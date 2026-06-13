<template>
  <div class="result-page">
    <!-- 加载 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <div>加载结果中...</div>
    </div>

    <!-- 空 -->
    <div v-else-if="!result" class="empty">
      <div style="font-size:48px;margin-bottom:16px;">📭</div>
      <div>未找到优化记录</div>
      <router-link to="/form" class="btn-primary" style="margin-top:24px;">去填写简历</router-link>
    </div>

    <!-- 结果 -->
    <div v-else class="result-content">
      <div class="result-header">
        <h2>✨ 优化结果</h2>
        <span class="position-badge">{{ positionLabel }}</span>
        <span class="score-badge" :class="scoreClass">📊 {{ result.score }} 分</span>
      </div>

      <!-- 亮点 & 建议 双栏 -->
      <div class="result-grid">
        <section class="result-section highlights">
          <h3>🌟 亮点提炼</h3>
          <ul>
            <li v-for="(item, i) in result.highlights" :key="i">{{ item }}</li>
          </ul>
        </section>

        <section class="result-section suggestions">
          <h3>💡 优化建议</h3>
          <ul>
            <li v-for="(item, i) in result.suggestions" :key="i">{{ item }}</li>
          </ul>
        </section>
      </div>

      <!-- 优化后简历 -->
      <section class="resume-section">
        <div class="resume-section-header">
          <h3>📄 优化后简历</h3>
          <div class="resume-section-actions">
            <button class="btn-icon" @click="copyResume">
              {{ copyText }}
            </button>
            <button class="btn-icon" @click="downloadResume">💾 下载</button>
          </div>
        </div>
        <pre class="resume-preview">{{ result.optimizedResume }}</pre>
      </section>

      <div class="result-actions">
        <router-link to="/form" class="btn-primary">🔄 重新生成</router-link>
        <router-link to="/" class="btn-secondary">返回首页</router-link>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.visible" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { OptimizeResult } from '../types'
import { POSITION_LABELS } from '../types'
import { getResultById } from '../api'

const route = useRoute()
const result = ref<OptimizeResult | null>(null)
const loading = ref(true)
const copyText = ref('📋 复制')

const toast = reactive({ visible: false, message: '', type: 'success', timer: 0 as unknown as ReturnType<typeof setTimeout> })

const positionLabel = computed(() => {
  return result.value ? POSITION_LABELS[result.value.targetPosition] : ''
})

const scoreClass = computed(() => {
  if (!result.value) return ''
  const s = result.value.score
  if (s >= 80) return 'score-high'
  if (s >= 50) return 'score-mid'
  return 'score-low'
})

function showToast(message: string, type = 'success') {
  toast.message = message
  toast.type = type
  toast.visible = true
  clearTimeout(toast.timer)
  toast.timer = setTimeout(() => { toast.visible = false }, 2000)
}

async function copyResume() {
  if (!result.value) return
  try {
    await navigator.clipboard.writeText(result.value.optimizedResume)
    copyText.value = '✅ 已复制'
    showToast('已复制到剪贴板')
    setTimeout(() => { copyText.value = '📋 复制' }, 2000)
  } catch {
    // fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = result.value.optimizedResume
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copyText.value = '✅ 已复制'
    showToast('已复制到剪贴板')
    setTimeout(() => { copyText.value = '📋 复制' }, 2000)
  }
}

function downloadResume() {
  if (!result.value) return
  const blob = new Blob([result.value.optimizedResume], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `resume_${result.value.id}.txt`
  a.click()
  URL.revokeObjectURL(url)
  showToast('下载成功')
}

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    try {
      const res = await getResultById(id)
      if (res.code === 0) {
        result.value = res.data
      }
    } catch (err) {
      console.error('获取优化结果失败:', err)
    }
  }
  loading.value = false
})
</script>
