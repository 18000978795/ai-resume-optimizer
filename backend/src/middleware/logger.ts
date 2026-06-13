import type { Request, Response, NextFunction } from 'express'

/** 请求日志中间件 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now()
  const { method, originalUrl } = req

  res.on('finish', () => {
    const duration = Date.now() - start
    const { statusCode } = res
    const icon = statusCode >= 400 ? '❌' : statusCode >= 300 ? '↪' : '✅'
    console.log(
      `[api] ${icon} ${method} ${originalUrl} → ${statusCode} (${duration}ms)`
    )
  })

  next()
}
