<template>
  <div class="form-page">
    <h2>📝 简历信息填写</h2>
    <p class="form-desc">请填写您的基本信息和经历，AI 将根据不同岗位方向为您生成优化后的简历。</p>

    <form @submit.prevent="handleSubmit" class="resume-form">
      <!-- 基本信息 -->
      <fieldset>
        <legend>👤 基本信息</legend>
        <div class="form-row">
          <div class="form-group">
            <label for="name">姓名 *</label>
            <input id="name" v-model="form.name" type="text" required placeholder="请输入姓名" />
          </div>
          <div class="form-group">
            <label for="email">邮箱 *</label>
            <input id="email" v-model="form.email" type="email" required placeholder="请输入邮箱" />
          </div>
          <div class="form-group">
            <label for="phone">手机号</label>
            <input id="phone" v-model="form.phone" type="tel" placeholder="请输入手机号" />
          </div>
        </div>
      </fieldset>

      <!-- 目标岗位 -->
      <fieldset>
        <legend>🎯 目标岗位</legend>
        <div class="position-selector">
          <label
            v-for="pos in positions"
            :key="pos.key"
            class="position-option"
            :class="{ active: form.targetPosition === pos.key }"
          >
            <input
              type="radio"
              v-model="form.targetPosition"
              :value="pos.key"
              required
            />
            <span class="position-icon">{{ pos.icon }}</span>
            <span class="position-label">{{ pos.label }}</span>
          </label>
        </div>
      </fieldset>

      <!-- 教育经历 -->
      <fieldset>
        <legend>🎓 教育经历</legend>
        <div v-if="form.education.length === 0" class="empty-hint">
          还没有添加教育经历，点击下方按钮添加
        </div>
        <div v-for="(edu, index) in form.education" :key="index" class="form-card">
          <div class="form-row">
            <div class="form-group">
              <label>学校 *</label>
              <input v-model="edu.school" type="text" required placeholder="学校名称" />
            </div>
            <div class="form-group">
              <label>学历 *</label>
              <input v-model="edu.degree" type="text" required placeholder="本科 / 硕士 / 博士" />
            </div>
            <div class="form-group">
              <label>专业 *</label>
              <input v-model="edu.major" type="text" required placeholder="专业名称" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>开始时间</label>
              <input v-model="edu.startDate" type="text" placeholder="2020-09" />
            </div>
            <div class="form-group">
              <label>结束时间</label>
              <input v-model="edu.endDate" type="text" placeholder="2024-06" />
            </div>
            <div class="form-group" style="justify-content: flex-end;">
              <button type="button" class="btn-remove" @click="removeEducation(index)">🗑 删除</button>
            </div>
          </div>
        </div>
        <button type="button" class="btn-add" @click="addEducation">＋ 添加教育经历</button>
      </fieldset>

      <!-- 工作/项目经验 -->
      <fieldset>
        <legend>💼 工作 / 项目经验</legend>
        <div v-if="form.experience.length === 0" class="empty-hint">
          还没有添加项目经验，点击下方按钮添加
        </div>
        <div v-for="(exp, index) in form.experience" :key="index" class="form-card">
          <div class="form-row">
            <div class="form-group">
              <label>公司 / 项目 *</label>
              <input v-model="exp.company" type="text" required placeholder="公司或项目名称" />
            </div>
            <div class="form-group">
              <label>职位 / 角色 *</label>
              <input v-model="exp.role" type="text" required placeholder="前端开发 / 后端开发" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>开始时间</label>
              <input v-model="exp.startDate" type="text" placeholder="2023-07" />
            </div>
            <div class="form-group">
              <label>结束时间</label>
              <input v-model="exp.endDate" type="text" placeholder="至今" />
            </div>
            <div class="form-group" style="justify-content: flex-end;">
              <button type="button" class="btn-remove" @click="removeExperience(index)">🗑 删除</button>
            </div>
          </div>
          <div class="form-group">
            <label>工作描述</label>
            <textarea
              v-model="exp.description"
              rows="3"
              placeholder="请描述您的主要职责和成果，如：负责XX模块开发，使用XX技术，实现XX效果"
            ></textarea>
          </div>
        </div>
        <button type="button" class="btn-add" @click="addExperience">＋ 添加经验</button>
      </fieldset>

      <!-- 技能 -->
      <fieldset>
        <legend>🛠 技能特长</legend>
        <div class="skills-input">
          <input
            v-model="skillInput"
            type="text"
            placeholder="输入技能后按回车添加（如 Vue3、Java、MySQL）"
            @keydown.enter.prevent="addSkill"
          />
          <div class="skill-tags" v-if="form.skills.length > 0">
            <span v-for="(skill, index) in form.skills" :key="index" class="skill-tag">
              {{ skill }}
              <button type="button" class="tag-remove" @click="removeSkill(index)">&times;</button>
            </span>
          </div>
          <div v-else class="empty-hint" style="margin-top:12px;">
            输入技能名称后按回车添加
          </div>
        </div>
      </fieldset>

      <!-- 补充信息 -->
      <fieldset>
        <legend>📋 补充信息</legend>
        <textarea
          v-model="form.additionalInfo"
          rows="3"
          placeholder="其他您希望 AI 了解的信息（如求职意向、个人优势、特殊要求等）"
        ></textarea>
      </fieldset>

      <div class="form-actions">
        <button type="submit" class="btn-primary btn-submit" :disabled="submitting">
          {{ submitting ? '⏳ 正在生成...' : '✨ 生成优化简历' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { PositionType, ResumeFormData } from '../types'
import { submitResume } from '../api'

const router = useRouter()
const submitting = ref(false)
const skillInput = ref('')

const positions = [
  { key: 'frontend' as PositionType, label: '前端开发', icon: '💻' },
  { key: 'backend' as PositionType, label: '后端开发', icon: '🖥️' },
  { key: 'fullstack' as PositionType, label: '全栈开发', icon: '🔧' },
]

const form = reactive<ResumeFormData>({
  name: '',
  email: '',
  phone: '',
  education: [],
  experience: [],
  skills: [],
  targetPosition: '' as PositionType,
  additionalInfo: '',
})

function addEducation() {
  form.education.push({ school: '', degree: '', major: '', startDate: '', endDate: '' })
}

function removeEducation(index: number) {
  form.education.splice(index, 1)
}

function addExperience() {
  form.experience.push({ company: '', role: '', startDate: '', endDate: '', description: '' })
}

function removeExperience(index: number) {
  form.experience.splice(index, 1)
}

function addSkill() {
  const value = skillInput.value.trim()
  if (value && !form.skills.includes(value)) {
    form.skills.push(value)
  }
  skillInput.value = ''
}

function removeSkill(index: number) {
  form.skills.splice(index, 1)
}

async function handleSubmit() {
  if (!form.targetPosition) {
    alert('请选择目标岗位')
    return
  }
  submitting.value = true
  try {
    const res = await submitResume(form)
    if (res.code === 0) {
      router.push(`/result/${res.data.id}`)
    } else {
      alert(res.message)
    }
  } catch {
    alert('网络错误，请确保后端已启动（npm run dev）')
  } finally {
    submitting.value = false
  }
}
</script>
