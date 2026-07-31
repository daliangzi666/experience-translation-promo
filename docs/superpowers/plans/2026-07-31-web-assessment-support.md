# 网页心理测评与支持体验实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 参考微信小程序的心理测评与心理支持页面，把同一套入口、文案、轻量互动和专业边界同步到宣传网页。

**Architecture:** 在现有静态单页中新增“测评与支持体验”区域。HTML 提供可访问的挂载点，原生 JavaScript 负责测评题目、结果提示、心情选择、支持入口和呼吸解压小游戏的状态渲染，CSS 延续小程序的深绿、珊瑚橙、鼠尾草绿和米白视觉系统。

**Tech Stack:** HTML、CSS、原生 JavaScript、GitHub Pages。

## Global Constraints

- 测评结果仅用于自我了解、课程匹配与成长记录，不替代临床诊断。
- 紧急危险提示必须保留，明确建议联系身边可信任的人、学校心理中心、正规专业资源或当地急救服务。
- 网页版需保留小程序已有的三类测评方向、三道题、三种结果语义和支持页的心情/支持/课程/游戏结构。
- 不新增第三方依赖，不覆盖工作区内已有素材和未纳入本次任务的文件。
- 交互应支持鼠标、键盘和移动端触摸，按钮使用真实 `button` 或链接元素。

---

### Task 1: 记录小程序参考内容并建立网页挂载点

**Files:**
- Modify: `site/index.html`

- [x] **Step 1: 添加测评入口和测评挂载点**

在支持服务卡片之后添加 `#assessment-support` 区域，其中包含 `#assessment` 和 `#support` 两个面板，分别使用 `data-assessment-app` 与 `data-support-app` 作为 JavaScript 挂载点。

- [x] **Step 2: 添加小程序同源的安全边界提示**

在区域底部写明测评不用于临床诊断，并保留紧急危险情况下联系可信任的人或当地急救服务的提醒。

### Task 2: 实现网页测评体验

**Files:**
- Modify: `site/script.js`

- [x] **Step 1: 写入三类方向和三道题**

复用小程序的“近期状态”“学习与生活”“支持需求”三类方向、时间提示和三道选择题。

- [x] **Step 2: 实现开始、选项、下一题和结果状态**

实现 `startAssessment`、`selectOption`、`submitAnswer`、`restartAssessment` 对应的网页行为，使用与小程序一致的分数区间和结果语义。

- [x] **Step 3: 将结果连接到支持面板**

结果页的“去看看支持方式”按钮滚动到 `#support`，并保留重新测评入口；未选择选项时通过已有 toast 给出提示。

### Task 3: 实现网页心理支持与解压体验

**Files:**
- Modify: `site/script.js`

- [x] **Step 1: 实现心情与支持方式选择**

同步“有点累”“压力中”“说不清”“还不错”四种心情，以及“先安静一下”“学一个方法”“找人聊聊”三种支持方式。

- [x] **Step 2: 实现课程卡片和十分钟呼吸小游戏**

同步两条课程内容、开始提示、呼吸动画状态和“完成这一轮”反馈，不把轻量互动描述为治疗。

- [x] **Step 3: 实现求助提醒**

提供与小程序一致的紧急支持弹窗/提示，说明项目提供的是日常支持与健康科普，不代替诊断和治疗。

### Task 4: 适配视觉与响应式布局

**Files:**
- Modify: `site/styles.css`

- [x] **Step 1: 添加测评面板样式**

使用小程序对应的页面标题、类型列表、题目卡片、选项高亮和结果面板样式，延续网页桌面端与移动端的断点。

- [x] **Step 2: 添加支持面板样式**

实现心情标签、支持方式、课程卡片、呼吸小游戏和安全提醒的桌面/移动布局。

### Task 5: 验证、提交与发布

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-07-31-web-assessment-support.md`

- [x] **Step 1: 运行脚本与差异检查**

运行 `node --check site/script.js`、`git diff --check`，并检查挂载点、题目数量、结果文案、支持内容与安全提示。

- [x] **Step 2: 提交并推送 GitHub Pages**

只提交本次网页功能相关文件，保留工作区其他未纳入任务的素材。

- [x] **Step 3: 线上验收**

检查线上首页、脚本、文章、视频和入口二维码资源均可访问，并确认新版页面包含心理测评与心理支持内容。
