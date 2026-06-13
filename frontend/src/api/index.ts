import type { ApiResponse, OptimizeResult, ResumeFormData } from '../types'

const BASE_URL = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  return res.json()
}

/** 提交简历并获取优化结果 */
export function submitResume(data: ResumeFormData): Promise<ApiResponse<OptimizeResult>> {
  return request('/resume/optimize', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/** 历史记录响应 */
export interface HistoryPage {
  items: OptimizeResult[]
  total: number
  page: number
  pageSize: number
}

/** 查询历史记录 */
export function getHistory(page = 1, pageSize = 10): Promise<ApiResponse<HistoryPage>> {
  return request(`/resume/history?page=${page}&pageSize=${pageSize}`)
}

/** 查询单条记录 */
export function getResultById(id: string): Promise<ApiResponse<OptimizeResult>> {
  return request(`/resume/result/${id}`)
}
