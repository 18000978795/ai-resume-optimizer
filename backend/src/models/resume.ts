import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise'
import type { OptimizeResult, ResumeRequest } from '../types'

// ============================================================
// 数据模型层 — MySQL CRUD
// ============================================================

/** 将 ResumeRequest + OptimizeResult 合并为一行记录 */
function toRow(req: ResumeRequest, result: OptimizeResult) {
  return [
    result.id,
    req.name,
    req.email,
    req.phone,
    JSON.stringify(req.education),
    JSON.stringify(req.experience),
    JSON.stringify(req.skills),
    req.targetPosition,
    req.additionalInfo || '',
    result.score,
    JSON.stringify(result.highlights),
    JSON.stringify(result.suggestions),
    result.optimizedResume,
  ]
}

/** 将 MySQL 行数据转为 OptimizeResult */
function rowToResult(row: RowDataPacket): OptimizeResult {
  return {
    id: row.id,
    createdAt: row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at),
    targetPosition: row.target_position,
    score: row.score,
    highlights: typeof row.highlights === 'string'
      ? JSON.parse(row.highlights)
      : row.highlights,
    suggestions: typeof row.suggestions === 'string'
      ? JSON.parse(row.suggestions)
      : row.suggestions,
    optimizedResume: row.optimized_resume,
  }
}

export const resumeModel = {
  /** 插入一条优化记录 */
  async insert(pool: Pool, req: ResumeRequest, result: OptimizeResult): Promise<void> {
    const row = toRow(req, result)
    await pool.execute(
      `INSERT INTO resume_records
       (id, name, email, phone, education, experience, skills,
        target_position, additional_info, score, highlights,
        suggestions, optimized_resume)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      row
    )
  },

  /** 分页查询历史记录 */
  async list(pool: Pool, page: number, pageSize: number): Promise<OptimizeResult[]> {
    const offset = (page - 1) * pageSize
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, target_position, score, highlights, suggestions,
              optimized_resume, created_at
       FROM resume_records
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [pageSize, offset]
    )
    return rows.map(rowToResult)
  },

  /** 根据 ID 查询单条记录 */
  async getById(pool: Pool, id: string): Promise<OptimizeResult | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, target_position, score, highlights, suggestions,
              optimized_resume, created_at
       FROM resume_records
       WHERE id = ?`,
      [id]
    )
    if (rows.length === 0) return null
    return rowToResult(rows[0])
  },

  /** 获取总记录数 */
  async count(pool: Pool): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM resume_records`
    )
    return (rows[0] as { total: number }).total
  },
}
