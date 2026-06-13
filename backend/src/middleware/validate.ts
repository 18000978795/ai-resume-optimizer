import type { Request, Response, NextFunction } from 'express'

const VALID_POSITIONS = ['frontend', 'backend', 'fullstack']

/** 校验简历优化请求体 */
export function validateOptimizeRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors: string[] = []
  const body = req.body

  if (!body || typeof body !== 'object') {
    res.status(400).json({ code: 1, message: '请求体不能为空', data: null })
    return
  }

  // 必填字段
  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    errors.push('姓名为必填项')
  }
  if (!body.email || typeof body.email !== 'string' || !body.email.trim()) {
    errors.push('邮箱为必填项')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('邮箱格式不正确')
  }

  // 目标岗位校验
  if (!body.targetPosition || !VALID_POSITIONS.includes(body.targetPosition)) {
    errors.push(`目标岗位无效，可选: ${VALID_POSITIONS.join(' / ')}`)
  }

  // 类型校验
  if (body.education && !Array.isArray(body.education)) {
    errors.push('教育经历格式错误')
  }
  if (body.experience && !Array.isArray(body.experience)) {
    errors.push('工作经验格式错误')
  }
  if (body.skills && !Array.isArray(body.skills)) {
    errors.push('技能列表格式错误')
  }

  if (errors.length > 0) {
    res.status(400).json({ code: 1, message: errors.join('；'), data: null })
    return
  }

  // 清洗数据
  body.name = body.name.trim()
  body.email = body.email.trim()
  body.phone = (body.phone || '').trim()
  body.additionalInfo = (body.additionalInfo || '').trim()
  body.education = body.education || []
  body.experience = body.experience || []
  body.skills = body.skills || []

  next()
}
