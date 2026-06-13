-- ============================================================
-- AI 简历优化助手 — 数据库初始化脚本
-- 使用方式：mysql -u root -p < scripts/init.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS ai_resume
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE ai_resume;

-- 简历优化记录表（提交信息 + 优化结果合并）
CREATE TABLE IF NOT EXISTS resume_records (
  id               VARCHAR(50)    PRIMARY KEY COMMENT '记录唯一标识',
  name             VARCHAR(100)   NOT NULL    COMMENT '姓名',
  email            VARCHAR(200)   NOT NULL    COMMENT '邮箱',
  phone            VARCHAR(30)    DEFAULT ''  COMMENT '手机号',
  education        JSON           NOT NULL    COMMENT '教育经历 [{school,degree,major,startDate,endDate}]',
  experience       JSON           NOT NULL    COMMENT '工作经验 [{company,role,startDate,endDate,description}]',
  skills           JSON           NOT NULL    COMMENT '技能列表 ["Vue3","TypeScript",...]',
  target_position  VARCHAR(20)    NOT NULL    COMMENT '目标岗位 frontend/backend/fullstack',
  additional_info  TEXT           NULL        COMMENT '补充信息',
  score            INT            DEFAULT 0   COMMENT '简历评分 0-100',
  highlights       JSON           NOT NULL    COMMENT 'AI提炼亮点 ["亮点1","亮点2",...]',
  suggestions      JSON           NOT NULL    COMMENT 'AI优化建议 ["建议1","建议2",...]',
  optimized_resume TEXT           NOT NULL    COMMENT '优化后的简历文本',
  created_at       DATETIME       NOT NULL    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

  INDEX idx_email (email),
  INDEX idx_position (target_position),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='简历优化记录表';
