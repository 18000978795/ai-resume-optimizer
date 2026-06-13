import type { Pool } from 'mysql2/promise'
import type { OptimizeResult, ResumeRequest } from '../types'
import { getAiProvider } from './aiProvider'
import { getPool } from '../config/database'
import { resumeModel } from '../models/resume'

// ============================================================
// 双模式存储引擎
// - MySQL 可用 → 持久化到数据库
// - MySQL 不可用 → 内存 Map（热重启丢失，但无需安装 MySQL）
// ============================================================
const memoryStore: Map<string, OptimizeResult> = new Map()
let idCounter = 0

let dbPool: Pool | null = null
let dbReady = false
let dbInitAttempted = false

async function initDb(): Promise<void> {
  if (dbInitAttempted) return
  dbInitAttempted = true
  dbPool = await getPool()
  dbReady = dbPool !== null
}

function generateId(): string {
  idCounter++
  return `res_${Date.now()}_${idCounter}`
}

// ============================================================
// 服务层公开方法（上层无需关心底层是 MySQL 还是内存）
// ============================================================
export const resumeService = {
  /**
   * 获取当前使用的存储模式
   */
  async getStorageMode(): Promise<string> {
    await initDb()
    return dbReady ? 'mysql' : 'memory'
  },

  /**
   * 提交简历并获取 AI 优化结果
   */
  async optimize(data: ResumeRequest): Promise<OptimizeResult> {
    await initDb()
    const provider = getAiProvider()
    const aiResult = await provider.optimize(data)

    // 分配 ID
    const record: OptimizeResult = {
      ...aiResult,
      id: generateId(),
    }

    // 存储
    if (dbReady && dbPool) {
      try {
        await resumeModel.insert(dbPool, data, record)
      } catch (err) {
        console.error('[db] 写入失败，降级到内存存储:', (err as Error).message)
        memoryStore.set(record.id, record)
      }
    } else {
      memoryStore.set(record.id, record)
    }

    return record
  },

  /**
   * 获取历史记录（分页）
   */
  async getHistory(page: number, pageSize: number): Promise<{
    items: OptimizeResult[]
    total: number
  }> {
    await initDb()

    if (dbReady && dbPool) {
      try {
        const [items, total] = await Promise.all([
          resumeModel.list(dbPool, page, pageSize),
          resumeModel.count(dbPool),
        ])
        return { items, total }
      } catch (err) {
        console.error('[db] 查询失败，降级到内存存储:', (err as Error).message)
      }
    }

    // 内存存储降级
    const all = Array.from(memoryStore.values()).reverse()
    const start = (page - 1) * pageSize
    return {
      items: all.slice(start, start + pageSize),
      total: all.length,
    }
  },

  /**
   * 根据 ID 获取单条结果
   */
  async getResultById(id: string): Promise<OptimizeResult | null> {
    await initDb()

    if (dbReady && dbPool) {
      try {
        const result = await resumeModel.getById(dbPool, id)
        if (result) return result
      } catch (err) {
        console.error('[db] 查询失败，降级到内存存储:', (err as Error).message)
      }
    }

    return memoryStore.get(id) ?? null
  },
}
