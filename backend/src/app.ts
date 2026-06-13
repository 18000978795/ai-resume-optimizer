import express from 'express'
import cors from 'cors'
import { resumeRouter } from './routes/resume'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/logger'

const app = express()

// 中间件
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(requestLogger)

// 路由
app.use('/api/resume', resumeRouter)

// 健康检查（含存储模式信息）
app.get('/api/health', async (_req, res) => {
  const { resumeService } = await import('./services/resume')
  const storageMode = await resumeService.getStorageMode()
  res.json({
    code: 0,
    message: 'ok',
    data: {
      status: 'running',
      storage: storageMode,
      timestamp: new Date().toISOString(),
    },
  })
})

// 错误处理
app.use(errorHandler)

export { app }
