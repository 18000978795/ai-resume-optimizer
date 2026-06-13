import { Router } from 'express'
import { optimize, getHistory, getResultById } from '../controllers/resume'
import { validateOptimizeRequest } from '../middleware/validate'

const router = Router()

/** POST /api/resume/optimize  提交简历并优化（含请求校验） */
router.post('/optimize', validateOptimizeRequest, optimize)

/** GET /api/resume/history  获取历史记录 */
router.get('/history', getHistory)

/** GET /api/resume/result/:id  获取单条优化结果 */
router.get('/result/:id', getResultById)

export { router as resumeRouter }
