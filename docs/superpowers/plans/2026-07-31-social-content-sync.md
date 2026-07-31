# 劳有心获成长局内容同步实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将账号「劳有心获成长局」及当前已更新的文章、视频、账号视觉素材接入宣传网页，并建立可持续追加的内容清单。

**Architecture:** 保持现有 GitHub Pages 静态单页，新增 `site/content-feed.js` 作为社交内容数据源，由 `site/script.js` 渲染文章与视频卡片；文章使用独立静态详情页，视频使用本地 HTML5 播放器，账号 logo 与劳动主题海报进入网页资源目录。

**Tech Stack:** HTML、CSS、原生 JavaScript、HTML5 video、GitHub Actions Pages。

## Global Constraints

- 社交账号名称统一显示为“劳有心获成长局”。
- 当前内容至少包含两篇文章和两条视频：AI与成就感、经历翻译四步法及其两种视频成片。
- 账号 logo 和劳动主题海报作为网页视觉素材使用，不覆盖原始附件。
- 小红书与抖音入口图作为二维码卡片使用，不覆盖原始附件。
- 以后新增内容只需向 `site/content-feed.js` 追加记录并放入对应媒体目录。
- 不将“已准备的内容”表述为已发布或已完成干预成效。

---

### Task 1: 准备内容与账号素材

**Files:**
- Create: `site/assets/social-logo.png`
- Create: `site/assets/labor-poster.jpg`
- Create: `site/assets/article-experience-cover.png`
- Create: `site/assets/article-ai-cover.jpg`
- Create: `site/assets/video-experience-poster.png`
- Create: `site/assets/video-paper-poster.jpg`
- Create: `site/articles/experience-translation.html` plus article images
- Create: `site/articles/ai-achievement.html` plus article images
- Create: `site/media/experience-translation.mp4`
- Create: `site/media/experience-translation-paper.mp4`

- [x] **Step 1: 复制账号标识与海报**

将用户提供的 logo 复制为 `social-logo.png`，将劳动主题海报复制为 `labor-poster.jpg`。

- [x] **Step 2: 复制文章详情页及依赖图片**

保持公众号 HTML 的相对图片目录，分别复制为两个可从网页打开的详情页。

- [x] **Step 3: 复制视频与封面**

将当前两条视频成片放入 `site/media/`，使用现有四格图和关键帧联系表作为 poster。

### Task 2: 增加社交账号内容同步区

**Files:**
- Create: `site/content-feed.js`
- Modify: `site/index.html`
- Modify: `site/script.js`
- Modify: `site/styles.css`

- [x] **Step 1: 写入账号与内容数据**

数据字段固定为 `type`、`date`、`category`、`title`、`excerpt`、`image`/`poster`、`href`/`src`。

- [x] **Step 2: 添加内容同步区**

在页面中展示账号 logo、账号名、更新说明、劳动主题海报，以及文章和视频卡片。

- [x] **Step 3: 渲染文章/视频卡片**

文章提供“阅读文章”链接，视频提供原生播放控件，内容数据从 `content-feed.js` 读取。

### Task 3: 文档、验证与发布

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-07-31-social-content-sync.md`

- [x] **Step 1: 写明后续更新方式**

README 说明新增文章、视频和封面的目录及数据字段。

- [x] **Step 2: 验证页面和资源**

运行 `node --check site/script.js`、`git diff --check`，检查内容条目数量、文章详情页、视频文件、poster、账号名和页面锚点。

- [x] **Step 3: 提交、推送与线上验收**

推送到 `main`，等待 GitHub Actions 成功，并检查线上首页、文章详情页和视频资源状态。

### Task 4: 增加社交平台入口二维码

**Files:**
- Create: `site/assets/xiaohongshu-entry.jpg`
- Create: `site/assets/douyin-entry.jpg`
- Modify: `site/content-feed.js`
- Modify: `site/index.html`
- Modify: `site/script.js`
- Modify: `site/styles.css`
- Modify: `README.md`

- [x] **Step 1: 放入两张平台入口图**

将用户提供的小红书与抖音图片复制到站点资源目录，保留二维码原图。

- [x] **Step 2: 渲染账号卡片**

在首页“内容更新”区域展示两个二维码入口，统一显示账号名“劳有心获成长局”和账号号 `laoyouxinhuo`。

- [ ] **Step 3: 验证并重新发布**

校验脚本、图片资源、页面结构和线上 GitHub Pages 结果。
