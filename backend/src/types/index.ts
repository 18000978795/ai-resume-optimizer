/** 岗位类型 */
export type PositionType = 'frontend' | 'backend' | 'fullstack'

/** 岗位标签 */
export const POSITION_LABELS: Record<PositionType, string> = {
  frontend: '前端开发',
  backend: '后端开发',
  fullstack: '全栈开发',
}

/** 教育经历 */
export interface Education {
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
}

/** 工作/项目经验 */
export interface Experience {
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
}

/** 简历表单请求体 */
export interface ResumeRequest {
  name: string
  email: string
  phone: string
  education: Education[]
  experience: Experience[]
  skills: string[]
  targetPosition: PositionType
  additionalInfo: string
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

/** API 统一响应 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** 数据库存储记录 */
export interface ResumeRecord {
  id: string
  name: string
  email: string
  phone: string
  education: string   // JSON string
  experience: string   // JSON string
  skills: string       // JSON string
  target_position: PositionType
  additional_info: string
  optimized_resume: string
  suggestions: string  // JSON string
  highlights: string   // JSON string
  created_at: string
}
