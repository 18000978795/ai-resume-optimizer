import type { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[error]', err.message)
  res.status(500).json({
    code: 1,
    message: err.message || '服务器内部错误',
    data: null,
  })
}
