import mysql from 'mysql2/promise'
import { config } from './index'

let pool: mysql.Pool | null = null

/**
 * 获取 MySQL 连接池
 * - 如果数据库不可用，返回 null
 * - 调用方根据返回值决定使用 MySQL 还是内存存储
 */
export async function getPool(): Promise<mysql.Pool | null> {
  if (pool) return pool

  try {
    pool = mysql.createPool({
      host: config.mysql.host,
      port: config.mysql.port,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 3000,
    })

    // 快速连接测试
    const conn = await pool.getConnection()
    conn.release()

    console.log(`[db] MySQL 已连接: ${config.mysql.host}:${config.mysql.port}/${config.mysql.database}`)
    return pool
  } catch (err) {
    console.warn(`[db] MySQL 不可用，使用内存存储: ${(err as Error).message}`)
    pool = null
    return null
  }
}
