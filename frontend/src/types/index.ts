/** 简历表单数据 */
export interface ResumeFormData {
  name: string
  email: string
  phone: string
  education: Education[]
  experience: Experience[]
  skills: string[]
  targetPosition: PositionType
  additionalInfo: string
}

export interface Education {
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
}

export interface Experience {
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
}

/** 目标岗位类型 */
export type PositionType = 'frontend' | 'backend' | 'fullstack'

/** 岗位标签映射 */
export const POSITION_LABELS: Record<PositionType, string> = {
  frontend: '前端开发',
  backend: '后端开发',
  fullstack: '全栈开发',
}

/** 优化结果 */
export interface OptimizeResult {
  id: string
  createdAt: string
  targetPosition: PositionType
  score: number           // 简历完整度评分 0-100
  optimizedResume: string
  suggestions: string[]
  highlights: string[]
}

/** API 响应格式 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
