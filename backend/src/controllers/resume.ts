import type { Request, Response, NextFunction } from 'express'
import { resumeService } from '../services/resume'

/** 提交简历并优化 */
export async function optimize(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await resumeService.optimize(req.body)
    res.json({ code: 0, message: '优化成功', data: result })
  } catch (err) {
    next(err)
  }
}

/** 获取历史记录 */
export async function getHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 10))
    const { items, total } = await resumeService.getHistory(page, pageSize)
    res.json({
      code: 0,
      message: 'ok',
      data: { items, total, page, pageSize },
    })
  } catch (err) {
    next(err)
  }
}

/** 获取单条优化结果 */
export async function getResultById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id)
    const result = await resumeService.getResultById(id)
    if (!result) {
      res.status(404).json({ code: 1, message: '记录不存在', data: null })
      return
    }
    res.json({ code: 0, message: 'ok', data: result })
  } catch (err) {
    next(err)
  }
}
