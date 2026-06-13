// ================================================================
// AI Provider 抽象接口
// - 当前使用 MockAiProvider 本地生成
// - 后续接入真实 AI（如 Claude API）只需实现 AiProvider 接口并替换
// ================================================================

import type { PositionType, ResumeRequest, OptimizeResult } from '../types'

/** AI 优化服务接口 —— 所有 Provider 必须实现 */
export interface AiProvider {
  readonly name: string
  optimize(data: ResumeRequest): Promise<OptimizeResult>
}

// ================================================================
// Mock 实现：基于规则模板的本地优化
// ================================================================

/** 技能分类映射 — 用于识别前端/后端技能 */
const SKILL_CATEGORIES: Record<string, string[]> = {
  frontend: ['html', 'css', 'javascript', 'typescript', 'vue', 'vue3', 'react', 'angular', 'svelte',
    'jquery', 'bootstrap', 'tailwind', 'sass', 'less', 'webpack', 'vite', 'babel', 'eslint',
    'next.js', 'nuxt', 'redux', 'pinia', 'vuex', 'axios', 'graphql', 'websocket', 'ajax'],
  backend: ['node', 'java', 'python', 'go', 'rust', 'c#', 'php', 'ruby', 'express', 'koa',
    'spring', 'django', 'flask', 'fastapi', 'gin', 'mysql', 'postgresql', 'mongodb', 'redis',
    'elasticsearch', 'rabbitmq', 'kafka', 'nginx', 'docker', 'kubernetes', 'linux'],
  devops: ['docker', 'kubernetes', 'k8s', 'jenkins', 'github actions', 'gitlab ci', 'aws', 'azure',
    'gcp', 'terraform', 'ansible', 'prometheus', 'grafana', 'ci/cd', 'nginx', 'linux'],
}

function categorizeSkills(skills: string[]): { frontend: string[], backend: string[], devops: string[] } {
  const result = { frontend: [] as string[], backend: [] as string[], devops: [] as string[] }
  for (const s of skills) {
    const lower = s.toLowerCase()
    if (SKILL_CATEGORIES.frontend.some(k => lower.includes(k))) result.frontend.push(s)
    if (SKILL_CATEGORIES.backend.some(k => lower.includes(k))) result.backend.push(s)
    if (SKILL_CATEGORIES.devops.some(k => lower.includes(k))) result.devops.push(s)
  }
  return result
}

/** 简历完整度评分 */
function calculateScore(data: ResumeRequest): number {
  let score = 30 // base
  if (data.name && data.email) score += 10
  if (data.phone) score += 5
  if (data.education.length > 0) score += 10
  if (data.experience.length > 0) score += 15
  if (data.experience.length > 1) score += 5
  if (data.skills.length >= 3) score += 10
  if (data.skills.length >= 6) score += 5
  if (data.additionalInfo) score += 10
  return Math.min(100, score)
}

/** 分析技能缺口 */
function analyzeSkillGaps(data: ResumeRequest, target: PositionType): string[] {
  const categorized = categorizeSkills(data.skills)
  const gaps: string[] = []

  if (target === 'frontend' || target === 'fullstack') {
    if (categorized.frontend.length === 0) gaps.push('缺少前端框架相关技能（建议补充 Vue/React/Angular 之一）')
    if (!data.skills.some(s => /css|sass|less|tailwind/i.test(s))) gaps.push('建议补充 CSS 预处理或 CSS 框架经验')
    if (!data.skills.some(s => /typescript/i.test(s))) gaps.push('TypeScript 已是前端标配，建议学习')
  }

  if (target === 'backend' || target === 'fullstack') {
    if (categorized.backend.length === 0) gaps.push('缺少后端语言或框架经验')
    if (!data.skills.some(s => /mysql|postgresql|mongodb|sql/i.test(s))) gaps.push('建议补充至少一种数据库技能')
    if (!data.skills.some(s => /redis|memcached/i.test(s))) gaps.push('缓存技术（Redis）是后端开发重要技能')
  }

  if (target === 'fullstack') {
    if (!data.skills.some(s => /docker|nginx|linux/i.test(s))) gaps.push('全栈工程师建议掌握基础 DevOps 技能（Docker/Nginx）')
  }

  return gaps
}

/** 根据岗位生成针对性建议 */
function generateSuggestions(data: ResumeRequest, target: PositionType): string[] {
  const suggestions: string[] = []
  const categorized = categorizeSkills(data.skills)

  if (data.experience.length === 0) {
    suggestions.push('建议添加至少一段项目或实习经历，展示实际开发能力')
  }

  if (data.experience.length > 0 && data.experience.some(e => !e.description)) {
    suggestions.push('每段经历应补充具体的工作描述，量化成果（如"性能提升 30%"）更具说服力')
  }

  if (data.education.length === 0) {
    suggestions.push('请补充教育背景，这是简历的基础信息')
  }

  if (target === 'frontend') {
    suggestions.push('在项目中强调性能优化相关的经验：懒加载、代码分割、资源压缩等')
    suggestions.push('补充前端工程化经验：Webpack/Vite 配置、CI/CD 流程、自动化测试')
    if (data.experience.length > 0) {
      suggestions.push('展示在项目中用到的具体技术栈版本和解决的问题场景')
    }
    if (categorized.devops.length === 0) {
      suggestions.push('了解基础 DevOps（Git/NPM 发包/简单部署）有助于提升竞争力')
    }
  }

  if (target === 'backend') {
    suggestions.push('强调数据库优化经验：索引优化、慢查询分析、读写分离方案')
    suggestions.push('补充系统设计相关经验：微服务架构、消息队列、分布式缓存')
    suggestions.push('展示对安全性的理解：SQL 注入防御、XSS 防护、认证授权机制')
    if (categorized.devops.length === 0) {
      suggestions.push('增加 DevOps 相关技能：Docker、K8s、监控告警、日志系统')
    }
  }

  if (target === 'fullstack') {
    suggestions.push('突出全栈项目经验，展示端到端的独立开发能力')
    suggestions.push('补充 DevOps 和云服务经验：Docker、AWS/阿里云、CI/CD 流程')
    suggestions.push('强调团队协作和项目管理能力，全栈工程师通常承担更多协调角色')
  }

  return suggestions.slice(0, 6) // 最多 6 条
}

/** 生成简历文本 */
function generateResumeText(data: ResumeRequest, target: PositionType): string {
  const edu = data.education[0]
  const exp = data.experience
  const categorized = categorizeSkills(data.skills)

  const positionTitle = {
    frontend: '前端开发工程师',
    backend: '后端开发工程师',
    fullstack: '全栈开发工程师',
  }[target]

  let skillsBlock = ''
  if (target === 'fullstack') {
    skillsBlock = [
      `前端：${categorized.frontend.join('、') || '待补充'}`,
      `后端：${categorized.backend.join('、') || '待补充'}`,
      `工具：${categorized.devops.join('、') || 'Git'}`,
    ].join('\n')
  } else if (target === 'frontend') {
    skillsBlock = categorized.frontend.join('、') || data.skills.join('、') || '待补充'
  } else {
    skillsBlock = categorized.backend.join('、') || data.skills.join('、') || '待补充'
  }

  const expSection = exp.length > 0
    ? exp.map(e => {
        const desc = e.description || '负责相关模块开发与维护'
        let bullets = ''
        if (target === 'frontend') {
          bullets = '   · 使用现代前端框架进行组件化开发与页面实现\n   · 参与前端工程化建设，优化构建流程与开发体验'
        } else if (target === 'backend') {
          bullets = '   · 参与后端服务设计与 RESTful API 开发\n   · 负责数据库设计与查询性能优化'
        } else {
          bullets = '   · 独立完成前后端功能模块的设计与开发\n   · 参与技术选型、数据库设计及部署运维'
        }
        return `■ ${e.company} | ${e.role} | ${e.startDate} - ${e.endDate}\n   ${desc}\n${bullets}`
      }).join('\n\n')
    : '请补充项目或工作经历'

  return [
    `${data.name} | 求职意向：${positionTitle}`,
    '',
    `📧 ${data.email}${data.phone ? ` | 📱 ${data.phone}` : ''}`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '教育背景',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    edu ? `${edu.school} | ${edu.major} | ${edu.degree} | ${edu.startDate} - ${edu.endDate}` : '请补充教育经历',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '技术技能',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    skillsBlock,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '项目 / 工作经验',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    expSection,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '自我评价',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    getSelfEvaluation(target),
    data.additionalInfo ? `\n备注：${data.additionalInfo}` : '',
  ].join('\n')
}

function getSelfEvaluation(target: PositionType): string {
  const evaluations: Record<PositionType, string> = {
    frontend: '热爱前端技术，关注行业动态，具备良好的学习能力和团队协作精神。注重代码质量和用户体验，追求写出可维护、高性能的前端代码。',
    backend: '热爱后端技术，对系统架构和高并发场景有浓厚兴趣。注重代码规范和系统稳定性，具备良好的问题分析和解决能力。',
    fullstack: '全栈工程师，能够从全局视角理解项目，具备独立交付完整功能的能力。善于学习新技术，注重工程实践和代码质量。',
  }
  return evaluations[target]
}

// ================================================================
// MockAiProvider
// ================================================================

export class MockAiProvider implements AiProvider {
  readonly name = 'mock'

  async optimize(data: ResumeRequest): Promise<OptimizeResult> {
    const { targetPosition: target } = data
    const categorized = categorizeSkills(data.skills)

    // 模拟 AI 分析延迟（50-150ms），后续接入真实 API 时无需改动调用方
    await new Promise(r => setTimeout(r, 80 + Math.random() * 70))

    const score = calculateScore(data)
    const skillGaps = analyzeSkillGaps(data, target)
    const suggestions = generateSuggestions(data, target)

    // 亮点提炼
    const highlights: string[] = []
    if (categorized.frontend.length >= 2) {
      highlights.push(`具备前端 ${categorized.frontend.slice(0, 3).join('、')} 技术能力`)
    }
    if (categorized.backend.length >= 2) {
      highlights.push(`掌握后端 ${categorized.backend.slice(0, 3).join('、')} 技术`)
    }
    if (data.experience.length >= 2) {
      highlights.push(`拥有 ${data.experience.length} 段项目/实习经验，实践经验丰富`)
    }
    if (data.skills.length >= 5) {
      highlights.push(`技能覆盖面广，掌握 ${data.skills.length} 项技术`)
    }
    if (categorized.devops.length >= 2) {
      highlights.push(`具备 DevOps 工程化能力，可独立完成部署运维`)
    }
    if (data.education.length > 0 && /硕士|博士/.test(data.education[0].degree)) {
      highlights.push(`${data.education[0].degree}学历，理论基础扎实`)
    }

    // 补全到至少 3 条
    if (highlights.length < 3) {
      if (!highlights.some(h => h.includes('学习'))) {
        highlights.push('良好的学习能力和技术热情')
      }
      if (!highlights.some(h => h.includes('经验'))) {
        highlights.push('有实际开发经验，能独立完成模块开发')
      }
    }

    return {
      id: '', // 由 service 层分配
      createdAt: new Date().toISOString(),
      targetPosition: target,
      score,
      highlights: highlights.slice(0, 5),
      suggestions: [...suggestions, ...skillGaps.map(g => `⚠️ ${g}`)],
      optimizedResume: generateResumeText(data, target),
    }
  }
}

// ================================================================
// 工厂函数 —— 根据配置返回对应的 Provider
// ================================================================

import { config } from '../config'

let _provider: AiProvider | null = null

export function getAiProvider(): AiProvider {
  if (!_provider) {
    // 后续接入真实 AI：替换为 new OpenAiProvider() / new ClaudeProvider()
    _provider = new MockAiProvider()
    console.log(`[ai] 使用 AI Provider: ${_provider.name}`)
  }
  return _provider
}
