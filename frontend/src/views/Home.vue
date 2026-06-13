<template>
  <div class="home">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-badge">✨ AI-Powered</div>
      <h1>AI 简历优化助手</h1>
      <p class="subtitle">
        基于 AI 的智能简历优化工具，针对不同开发岗位生成专业简历。<br />
        帮你精准匹配岗位需求，提升简历通过率。
      </p>
      <router-link to="/form" class="btn-primary btn-lg">🚀 立即开始优化</router-link>
      <div class="hero-preview">
        <div class="preview-card">
          <div class="preview-dot"></div>
          <div class="preview-line short"></div>
          <div class="preview-line"></div>
          <div class="preview-line medium"></div>
        </div>
      </div>
    </section>

    <!-- 三步流程 -->
    <section class="how-it-works">
      <h2>三步生成优化简历</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>填写简历</h3>
          <p>输入教育背景、项目经验、技能特长等基本信息</p>
        </div>
        <div class="step-connector">
          <span></span>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>选择方向</h3>
          <p>选定目标岗位：前端 / 后端 / 全栈开发</p>
        </div>
        <div class="step-connector">
          <span></span>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>一键优化</h3>
          <p>AI 智能生成专业简历，含亮点提炼与优化建议</p>
        </div>
      </div>
    </section>

    <!-- 功能亮点 -->
    <section class="features">
      <div class="feature-card">
        <div class="feature-icon-wrap">📝</div>
        <h3>信息填写</h3>
        <p>填写基础信息、教育经历、工作经验、技能特长，支持动态增删</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon-wrap">🎯</div>
        <h3>岗位定向</h3>
        <p>支持前端开发、后端开发、全栈开发三个方向，精准匹配岗位需求</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon-wrap">✨</div>
        <h3>智能优化</h3>
        <p>根据不同岗位要求，自动提炼亮点并生成针对性的优化建议</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon-wrap">💡</div>
        <h3>提升建议</h3>
        <p>指出简历薄弱环节，给出可操作的改进方向，持续迭代</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon-wrap">📄</div>
        <h3>专业输出</h3>
        <p>生成格式规范的简历文本，可直接用于投递或导入招聘平台</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon-wrap">⚡</div>
        <h3>即时响应</h3>
        <p>提交即出结果，无需等待，随时修改信息重新生成</p>
      </div>
    </section>

    <!-- 技术栈 -->
    <section class="tech-stack">
      <h2>项目技术栈</h2>
      <div class="tech-tags">
        <span class="tech-tag vue">Vue 3</span>
        <span class="tech-tag ts">TypeScript</span>
        <span class="tech-tag vite">Vite</span>
        <span class="tech-tag node">Node.js</span>
        <span class="tech-tag express">Express</span>
        <span class="tech-tag mysql">MySQL</span>
        <span class="tech-tag">Vue Router</span>
        <span class="tech-tag">RESTful API</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>
