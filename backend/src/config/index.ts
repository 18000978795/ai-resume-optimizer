export const config = {
  port: Number(process.env.PORT) || 3000,
  /** 数据库配置（阶段四使用） */
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai_resume',
  },
  /** AI API 配置（后续接入使用） */
  ai: {
    enabled: false,
    apiKey: process.env.AI_API_KEY || '',
    apiUrl: process.env.AI_API_URL || '',
  },
}
