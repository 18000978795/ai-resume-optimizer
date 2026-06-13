import { app } from './app'
import { config } from './config'

app.listen(config.port, () => {
  console.log(`[server] AI 简历优化助手后端已启动: http://localhost:${config.port}`)
})
