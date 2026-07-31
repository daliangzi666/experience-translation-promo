# 互动支持入口与“03 了解自己的时刻”实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把支持服务卡片变成可打开的真实内容入口，加入一个可互动的解压小游戏，重做“03 了解自己的时刻”的对齐关系，并替换社交账号区两个视频的旧版命名。

**Architecture:** 保留现有单页 HTML/CSS/原生 JavaScript 架构。服务卡片使用原生按钮打开无依赖模态层，模态内容由 `site/script.js` 的静态配置渲染；快速测评和心理支持继续连接已有的页面互动，干预课程、科普文章与科普视频提供可立即阅读/练习/观看的预览。第 03 区通过新的杂志式索引栏、等高网格和 flex 面板统一左右边界。

**Tech Stack:** HTML5, CSS3, 原生 JavaScript, GitHub Pages

## Global Constraints

- 保留现有出版物式暖纸色、墨黑、森林绿、陶土橙和赭黄色调。
- 服务入口必须可用键盘和触屏操作，并支持 Escape 关闭弹层。
- 测评结果只用于自我了解，不替代临床诊断；页面继续保留专业边界提醒。
- 不删除现有测评、心理支持、文章、视频、社交账号二维码和文章页面。
- 视频标题中不得出现“网页视频版”或“纸片人视频版”。
- 保留当前 `site/content-feed.js` 中与本需求无关的用户改动和未跟踪素材。

### Task 1: 将支持服务卡片接入真实内容

**Files:**
- Modify: `site/index.html:103-138` — 将六张服务卡片改为可访问按钮，并增加服务模态层骨架。
- Modify: `site/script.js` — 增加服务内容配置、模态打开/关闭、支持选择和课程预览逻辑。
- Modify: `site/styles.css:221-235` and append modal styles — 统一按钮卡片外观、弹层布局与互动状态。

**Interfaces:**
- Consumes: 现有 `renderAssessment()`、`renderSupport()`、`window.socialFeed` 和文章路径。
- Produces: `[data-service-open]` 服务入口、`[data-service-modal]` 弹层、`[data-service-action]` 互动动作和 `[data-game-board]` 解压游戏区。

- [ ] **Step 1: 把服务卡片改成可操作入口**

为 `快速测评`、`心理支持`、`干预课程`、`解压游戏`、`科普文章`、`科普视频` 添加 `data-service-open`，将 `article` 元素替换为 `button type="button"`，保留现有文字层级和视觉类名。

- [ ] **Step 2: 增加模态层骨架**

在 `site/index.html` 的 toast 前加入一个带 `role="dialog"`、`aria-modal="true"`、标题 ID、关闭按钮和 `[data-service-modal-content]` 容器的模态层；初始状态使用 `hidden`，背景层也可点击关闭。

- [ ] **Step 3: 实现五类实际内容与视频预览**

在 `site/script.js` 增加服务配置：测评入口包含方向说明和跳转到现有 03 测评；心理支持包含情绪选择和支持建议并可跳转到现有支持区；干预课程包含两个可展开的课程练习；解压游戏包含“接住小光点”计时互动；科普文章提供现有两篇文章链接和可读摘要；科普视频提供现有两个视频的可播放预览。所有内容均为当前可用的轻量体验，并写明后续可继续填充。

- [ ] **Step 4: 实现交互与键盘行为**

通过事件委托处理打开、关闭、Escape、模态内动作和小游戏计分；打开时保存触发按钮，关闭后恢复焦点；小游戏开始后显示 20 秒倒计时、计分和重新开始按钮，不依赖外部库。

- [ ] **Step 5: 运行页面检查**

检查六张卡片均能打开、模态关闭按钮与背景可用、Escape 可关闭、课程可展开、小游戏可得分、文章链接可进入、视频可播放且没有遮挡或横向溢出。

### Task 2: 重做“03 了解自己的时刻”版式

**Files:**
- Modify: `site/index.html:142-178` — 增加明确的 `03` 索引栏和标题分区结构。
- Modify: `site/styles.css:236-263` and responsive media blocks — 让标题、两块体验卡和安全提示对齐，并在窄屏下自然折叠。

**Interfaces:**
- Consumes: 现有 `assessment-panel`、`support-panel` 和页面互动容器。
- Produces: `.experience-heading-index`、`.experience-heading-copy`、等高 `.experience-panel` 网格。

- [ ] **Step 1: 调整 HTML 层级**

将 `03 / 先从一个入口开始` 改为 `03 / 了解自己的时刻`，把大号编号、中文栏目名、标题和说明分成索引栏与内容栏，保持 `#assessment` 和 `#support` 锚点不变。

- [ ] **Step 2: 建立杂志式对齐规则**

让标题区使用两列网格和底部细线；体验区使用两列等高网格；面板采用纵向 flex，使两个面板的顶部、内容边缘和底部按钮区域一致；安全提示与网格左右边界对齐。

- [ ] **Step 3: 补齐响应式规则**

在 900px 以下将标题区和体验区折叠为单列；在 520px 以下缩小编号、内边距和字体，保证 03、标题和两块面板不发生挤压或横向滚动。

- [ ] **Step 4: 复核桌面与手机视觉**

分别查看 1440px 左右桌面视口和 390px 左右手机视口，确认左右边界、卡片顶部和安全提示均有统一起止线。

### Task 3: 重命名社交账号区视频

**Files:**
- Modify: `site/content-feed.js:24-39` — 替换两个视频标题及其简介中的旧版格式叫法。

**Interfaces:**
- Consumes: 现有两个 MP4 文件和海报素材。
- Produces: 社交内容区展示的新视频名称。

- [ ] **Step 1: 更新视频名称**

将普通视频命名为“把经历说成能力｜四步成长记录”，将纸片人视频命名为“一张纸片，讲清一段成长”，并同步调整简介，让用户不需要通过“网页视频版/纸片人视频版”区分内容。

- [ ] **Step 2: 检查文案残留**

全站搜索 `网页视频版` 和 `纸片人视频版`，结果应为 0；视频播放器、海报和播放路径保持不变。

### Task 4: 构建、发布与线上复核

**Files:**
- Modify: `site/index.html`, `site/styles.css`, `site/script.js`, `site/content-feed.js`
- Verify: GitHub Pages 线上首页及文章/视频入口

**Interfaces:**
- Consumes: Task 1-3 完成的页面和内容。
- Produces: 可直接访问的 GitHub Pages 更新版本。

- [ ] **Step 1: 做结构检查**

检查 HTML 标签闭合、服务入口数量、模态关键属性、`data-service-open` 类型和旧视频名称残留。

- [ ] **Step 2: 做浏览器复核**

打开本地页面，分别测试桌面端和移动端：点击服务卡片、关闭弹层、运行小游戏、完成课程展开、查看 03 区对齐和播放视频。

- [ ] **Step 3: 发布到 GitHub Pages**

提交本次有意修改并推送到 `main`，等待 GitHub Pages 部署完成。

- [ ] **Step 4: 线上最终检查**

确认首页、CSS、JavaScript、文章页面和媒体资源可加载；确认线上页面仍保留原有测评、心理支持、文章、视频与社交入口。
