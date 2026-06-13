<template>
  <div id="app">
    <header class="app-header">
      <router-link to="/" class="logo">AI 简历优化助手</router-link>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/form">填写简历</router-link>
      </nav>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
