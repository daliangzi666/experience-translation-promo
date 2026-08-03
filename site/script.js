(() => {
  const toast = document.querySelector('[data-toast]');
  const template = `劳有所获·职有底气·成长行动清单\n\n我投入过的一项真实劳动经历：……\n我从中获得的能力或价值：……\n我想继续练习的一项能力：……\n我下一步想完成的行动：……\n我需要联系的支持对象：……\n我想留下的作品、反思或能力证据：……`;
  let toastTimer;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character]));

  const renderSocialFeed = () => {
    const feed = document.querySelector('[data-social-feed]');
    const items = Array.isArray(window.socialFeed) ? window.socialFeed : [];
    if (!feed || !items.length) return;

    feed.innerHTML = items.map((item) => {
      const media = item.type === 'video'
        ? `<div class="feed-media feed-video"><video controls preload="metadata" poster="${escapeHtml(item.poster)}"><source src="${escapeHtml(item.src)}" type="video/mp4" />当前浏览器不支持视频播放。</video></div>`
        : `<div class="feed-media"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" /></div>`;
      const action = item.href
        ? `<a class="feed-link" href="${escapeHtml(item.href)}">阅读文章 <span aria-hidden="true">↗</span></a>`
        : item.type === 'video'
          ? `<span class="feed-link feed-link-muted">点击播放器观看 <span aria-hidden="true">▶</span></span>`
          : `<span class="feed-link feed-link-muted">账号内容 <span aria-hidden="true">✦</span></span>`;
      return `<article class="feed-card feed-${escapeHtml(item.type)}">${media}<div class="feed-body"><div class="feed-meta"><span>${escapeHtml(item.category)}</span><time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.excerpt)}</p>${action}</div></article>`;
    }).join('');
  };

  const renderSocialPlatforms = () => {
    const channels = document.querySelector('[data-social-platforms]');
    const platforms = Array.isArray(window.socialPlatforms) ? window.socialPlatforms : [];
    if (!channels || !platforms.length) return;

    channels.innerHTML = platforms.map((platform) => {
      const link = platform.href
        ? `<a class="channel-link" href="${escapeHtml(platform.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(platform.linkText || '打开账号主页')} <span aria-hidden="true">↗</span></a>`
        : '';
      const image = platform.href
        ? `<a class="channel-image-link" href="${escapeHtml(platform.href)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(platform.image)}" alt="${escapeHtml(platform.platform)}账号分享入口二维码" loading="lazy" /></a>`
        : `<img src="${escapeHtml(platform.image)}" alt="${escapeHtml(platform.platform)}账号入口二维码" loading="lazy" />`;
      return `<article class="channel-card"><div class="channel-copy"><span class="channel-platform">${escapeHtml(platform.platform)}</span><strong>${escapeHtml(platform.account)}</strong><small>${escapeHtml(platform.note)}</small><span class="channel-handle">${escapeHtml(platform.handle)}</span>${link}</div>${image}</article>`;
    }).join('');
  };

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
  };

  const assessmentTypes = [
    { name: '能力与价值', note: '了解劳动带来的能力增值与价值确认', time: '约 3 分钟' },
    { name: '职业准备', note: '看看劳动经历如何连接下一步就业行动', time: '约 5 分钟' },
    { name: '支持与归属', note: '找到课程、任务与资源联结的需要', time: '约 3 分钟' },
  ];
  const assessmentQuestions = [
    {
      prompt: '最近一项真实劳动经历中，你能说清自己完成了什么、学会了什么吗？',
      options: [{ label: '还说不清', value: 0 }, { label: '能说出一些', value: 1 }, { label: '比较清楚', value: 2 }],
    },
    {
      prompt: '当你想到下一步学习或就业行动时，你有多大把握把经历讲出来？',
      options: [{ label: '还没有把握', value: 0 }, { label: '可以试着讲', value: 1 }, { label: '比较有把握', value: 2 }],
    },
    {
      prompt: '在需要帮助时，你能找到同伴、老师或专业资源吗？',
      options: [{ label: '还不太能', value: 0 }, { label: '知道一些入口', value: 1 }, { label: '可以找到', value: 2 }],
    },
  ];
  const assessmentState = {
    selectedType: 0,
    started: false,
    resultVisible: false,
    questionIndex: 0,
    selectedOption: -1,
    answers: [],
  };

  const getAssessmentResult = () => {
    const score = assessmentState.answers.reduce((total, value) => total + value, 0);
    if (score <= 2) {
      return {
        title: '你已经积累了一些成长线索',
        copy: '可以把这次结果留下来，再回到一项真实劳动经历中，看看自己的能力、价值和下一步行动。',
      };
    }
    if (score >= 5) {
      return {
        title: '现在可以为自己补充更多支持',
        copy: '你不必独自完成下一步。可以先选择课程、劳动任务或支持资源，也可以和身边信任的人说一说。',
      };
    }
    return {
      title: '你的成长路径还有一些可以补足的地方',
      copy: '可以先从一项小任务或一堂课程开始，把经历中的能力和价值慢慢说清楚，再决定下一步行动。',
    };
  };

  const renderAssessment = () => {
    const app = document.querySelector('[data-assessment-app]');
    if (!app) return;

    if (!assessmentState.started) {
      app.innerHTML = `<div class="assessment-intro-copy">选择一个方向，按自己的节奏完成。</div><div class="assessment-type-list">${assessmentTypes.map((type, index) => `<button type="button" class="assessment-type ${assessmentState.selectedType === index ? 'is-selected' : ''}" data-assessment-type="${index}" aria-pressed="${assessmentState.selectedType === index}"><span class="assessment-radio">${assessmentState.selectedType === index ? '•' : ''}</span><span class="assessment-type-copy"><strong>${escapeHtml(type.name)}</strong><small>${escapeHtml(type.note)}</small></span><span class="assessment-time">${escapeHtml(type.time)}</span></button>`).join('')}</div><p class="assessment-notice"><span>i</span>测评结果仅供自我了解，不用于临床诊断；如果你正处在紧急危险中，请优先联系身边可信任的人或当地急救服务。</p><button type="button" class="experience-button experience-button-dark" data-assessment-action="start">开始这份测评 <span aria-hidden="true">→</span></button>`;
      return;
    }

    if (assessmentState.resultVisible) {
      const result = getAssessmentResult();
      app.innerHTML = `<div class="assessment-result"><div class="result-mark" aria-hidden="true">✓</div><h4>${escapeHtml(result.title)}</h4><p>${escapeHtml(result.copy)}</p><button type="button" class="experience-button experience-button-dark" data-assessment-action="support">去看看支持方式 <span aria-hidden="true">→</span></button><button type="button" class="experience-button experience-button-outline" data-assessment-action="restart">再做一次测评</button></div>`;
      return;
    }

    const question = assessmentQuestions[assessmentState.questionIndex];
    app.innerHTML = `<div class="question-topline"><span>0${assessmentState.questionIndex + 1} / 03</span><strong>${escapeHtml(assessmentTypes[assessmentState.selectedType].name)}</strong></div><h4 class="question-prompt">${escapeHtml(question.prompt)}</h4><div class="question-option-list">${question.options.map((option) => `<button type="button" class="question-option ${assessmentState.selectedOption === option.value ? 'is-selected' : ''}" data-assessment-option="${option.value}" aria-pressed="${assessmentState.selectedOption === option.value}"><span class="question-dot" aria-hidden="true"></span>${escapeHtml(option.label)}</button>`).join('')}</div><button type="button" class="experience-button experience-button-dark" data-assessment-action="submit">${assessmentState.questionIndex === assessmentQuestions.length - 1 ? '查看我的提示' : '下一题'} <span aria-hidden="true">→</span></button>`;
  };

  const assessmentApp = document.querySelector('[data-assessment-app]');
  if (assessmentApp) {
    assessmentApp.addEventListener('click', (event) => {
      const typeButton = event.target.closest('[data-assessment-type]');
      if (typeButton) {
        assessmentState.selectedType = Number(typeButton.dataset.assessmentType);
        renderAssessment();
        return;
      }

      const optionButton = event.target.closest('[data-assessment-option]');
      if (optionButton) {
        assessmentState.selectedOption = Number(optionButton.dataset.assessmentOption);
        renderAssessment();
        return;
      }

      const action = event.target.closest('[data-assessment-action]')?.dataset.assessmentAction;
      if (action === 'start') {
        assessmentState.started = true;
        assessmentState.resultVisible = false;
        assessmentState.questionIndex = 0;
        assessmentState.selectedOption = -1;
        assessmentState.answers = [];
        renderAssessment();
      } else if (action === 'submit') {
        if (assessmentState.selectedOption < 0) {
          showToast('先选择一个答案吧。');
          return;
        }
        const answers = assessmentState.answers.concat([assessmentState.selectedOption]);
        if (assessmentState.questionIndex < assessmentQuestions.length - 1) {
          assessmentState.answers = answers;
          assessmentState.questionIndex += 1;
          assessmentState.selectedOption = -1;
        } else {
          assessmentState.answers = answers;
          assessmentState.resultVisible = true;
        }
        renderAssessment();
      } else if (action === 'restart') {
        assessmentState.started = false;
        assessmentState.resultVisible = false;
        assessmentState.questionIndex = 0;
        assessmentState.selectedOption = -1;
        assessmentState.answers = [];
        renderAssessment();
      } else if (action === 'support') {
        document.querySelector('#support')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  const supportMoods = ['有点累', '压力中', '说不清', '还不错'];
  const supportTypes = [
    { name: '先安静一下', note: '呼吸练习与短时放松' },
    { name: '找一位支持者', note: '朋辈、教师与专业资源联结' },
    { name: '练一个行动', note: '课程练习与劳动任务建议' },
  ];
  const supportCourses = [
    { title: '把劳动经历放在桌面上', note: '识别投入、成果与能力证据，练习说清一项真实经历', duration: '12 分钟', tag: '育能课程' },
    { title: '为下一步行动留出空间', note: '用一段短练习整理压力，再选一项可以完成的劳动任务', duration: '8 分钟', tag: '育心支持' },
  ];
  const supportState = { selectedMood: -1, selectedSupport: 0, gameStarted: false };

  const renderSupport = () => {
    const app = document.querySelector('[data-support-app]');
    if (!app) return;

    const game = supportState.gameStarted
      ? `<div class="support-game support-game-playing"><div class="breath-orbit" aria-hidden="true"><div class="breath-core"></div></div><strong>跟着圆点，慢慢吸气，再慢慢呼气。</strong><small>不需要做到完美，只要把注意力带回来。</small><button type="button" class="experience-button experience-button-gold" data-support-action="finish-game">完成这一轮</button></div>`
      : `<button type="button" class="support-game support-game-entry" data-support-action="start-game"><span class="game-circle">PLAY</span><span><strong>十分钟解压游戏</strong><small>把注意力带回当下，轻轻玩一会儿。</small></span><b aria-hidden="true">进入 →</b></button>`;

    app.innerHTML = `<div class="support-question">此刻的我需要……</div><div class="mood-list">${supportMoods.map((mood, index) => `<button type="button" class="mood-chip ${supportState.selectedMood === index ? 'is-selected' : ''}" data-support-mood="${index}" aria-pressed="${supportState.selectedMood === index}">${escapeHtml(mood)}</button>`).join('')}</div><div class="support-subheading"><span>A SMALL STEP</span><strong>想先获得哪种支持？</strong></div><div class="support-option-list">${supportTypes.map((type, index) => `<button type="button" class="support-option ${supportState.selectedSupport === index ? 'is-selected' : ''}" data-support-type="${index}" aria-pressed="${supportState.selectedSupport === index}"><span>0${index + 1}</span><span><strong>${escapeHtml(type.name)}</strong><small>${escapeHtml(type.note)}</small></span><b aria-hidden="true">→</b></button>`).join('')}</div><div class="support-subheading support-course-heading"><span>COURSE / TASK</span><strong>给真实行动一个支点</strong></div><div class="support-course-list">${supportCourses.map((course) => `<button type="button" class="support-course" data-support-course="${escapeHtml(course.title)}"><span>${escapeHtml(course.tag)}</span><strong>${escapeHtml(course.title)}</strong><small>${escapeHtml(course.note)}</small><em>${escapeHtml(course.duration)} <b>开始 →</b></em></button>`).join('')}${game}</div><div class="support-safety"><strong>需要更及时的帮助？</strong><p>本项目提供的是日常支持与健康科普，不代替诊断和治疗。如果情况紧急，请优先联系身边的人或专业机构。</p><button type="button" data-support-action="safety">查看求助提醒</button></div>`;
  };

  const supportApp = document.querySelector('[data-support-app]');
  if (supportApp) {
    supportApp.addEventListener('click', (event) => {
      const moodButton = event.target.closest('[data-support-mood]');
      if (moodButton) {
        supportState.selectedMood = Number(moodButton.dataset.supportMood);
        renderSupport();
        return;
      }
      const typeButton = event.target.closest('[data-support-type]');
      if (typeButton) {
        supportState.selectedSupport = Number(typeButton.dataset.supportType);
        renderSupport();
        return;
      }
      const courseButton = event.target.closest('[data-support-course]');
      if (courseButton) {
        showToast(`${courseButton.dataset.supportCourse}已加入今天，先做一小步就好。`);
        return;
      }
      const action = event.target.closest('[data-support-action]')?.dataset.supportAction;
      if (action === 'start-game') {
        supportState.gameStarted = true;
        renderSupport();
      } else if (action === 'finish-game') {
        supportState.gameStarted = false;
        renderSupport();
        showToast('这一轮放松完成，做得很好。');
      } else if (action === 'safety') {
        showToast('如果你正处在紧急危险中，请马上联系身边可信任的人或当地急救服务。');
      }
    });
  }

  const serviceModal = document.querySelector('[data-service-modal]');
  const serviceModalContent = serviceModal?.querySelector('[data-service-modal-content]');
  let serviceReturnFocus = null;
  let gameTimer = null;
  let gameScore = 0;
  let gameTime = 20;

  const serviceTemplates = {
    assessment: `
      <p class="service-modal-kicker">ASSESSMENT / 01 · 劳动成长入口</p>
      <h2 id="service-modal-title">先看见劳动中的收获，<em>再找到下一步。</em></h2>
      <p class="service-modal-lede">这是一份面向大学生劳动成长的轻量工具，不给你贴标签，而是帮助你把真实经历中的能力、价值、职业准备和支持需要说清楚。</p>
      <div class="service-modal-section">
        <div class="service-modal-section-title"><strong>你可以从这三个方向开始</strong><span>约 3—5 分钟</span></div>
        <div class="service-modal-list">
          <div><strong>能力与价值</strong><small>了解劳动带来的能力增值与价值确认。</small></div>
          <div><strong>职业准备</strong><small>看看劳动经历如何连接下一步就业行动。</small></div>
          <div><strong>支持与归属</strong><small>找到课程、任务与资源联结的需要。</small></div>
        </div>
        <p class="service-modal-note"><strong>提示：</strong>结果用于教育支持、课程匹配与成长记录，你可以按自己的节奏完成，也可以随时停下来。</p>
      </div>
      <div class="service-modal-actions"><button class="button button-primary" type="button" data-service-modal-action="jump-assessment">进入 03 测评区 <span aria-hidden="true">→</span></button></div>`,
    support: `
      <p class="service-modal-kicker">SUPPORT / 02 · 连接支持资源</p>
      <h2 id="service-modal-title">今天需要哪一种<em>支持？</em></h2>
      <p class="service-modal-lede">不用准备完整的答案。先选一个最接近你的感受，我们会给你一条轻一点的课程、任务或支持资源建议。</p>
      <div class="service-modal-section">
        <div class="service-modal-section-title"><strong>此刻的我……</strong><span>选一个就好</span></div>
        <div class="modal-choice-grid">
          <button class="modal-choice" type="button" data-modal-mood="有点累">有点累</button>
          <button class="modal-choice" type="button" data-modal-mood="压力中">压力中</button>
          <button class="modal-choice" type="button" data-modal-mood="说不清">说不清</button>
          <button class="modal-choice" type="button" data-modal-mood="还不错">还不错</button>
        </div>
        <p class="modal-support-response" data-modal-support-response>选择一个感受后，这里会出现一条适合现在的建议。</p>
      </div>
      <div class="service-modal-actions"><button class="button button-primary" type="button" data-service-modal-action="jump-support">进入心理支持区 <span aria-hidden="true">→</span></button></div>`,
    course: `
      <p class="service-modal-kicker">COURSE / 03 · 育心—育能—育志</p>
      <h2>把方法放进真实任务，<em>让能力留下证据。</em></h2>
      <p class="service-modal-lede">干预课程把心理资本、能力训练和职业行动放进真实劳动任务。下面先提供两个体验单元，后续可以继续填充完整的6讲课程与21天任务。</p>
      <div class="service-modal-section">
        <div class="service-modal-section-title"><strong>先试一节小课</strong><span>轻量体验</span></div>
        <div class="modal-course-list">
          <article class="modal-course-card"><small>压力调适 · 12 分钟</small><strong>把压力放在桌面上</strong><p>识别压力来源，练习把“全部都要做”拆成今天的一小步。</p><button class="modal-course-toggle" type="button" data-course-toggle>展开练习</button><div class="modal-course-detail">写下此刻最占脑子的三件事，再圈出一件“今天只做第一步”即可完成的事。</div></article>
          <article class="modal-course-card"><small>睡眠支持 · 8 分钟</small><strong>睡前给大脑留白</strong><p>用一段短练习把注意力从反复思考带回呼吸和身体。</p><button class="modal-course-toggle" type="button" data-course-toggle>展开练习</button><div class="modal-course-detail">试着做三轮慢呼吸：吸气数 4 拍，呼气数 6 拍，把肩膀放松下来。</div></article>
        </div>
      </div>`,
    game: `
      <p class="service-modal-kicker">PLAY / 04 · 给自己十分钟</p>
      <h2>接住一颗小光点，<em>把注意力带回来。</em></h2>
      <p class="service-modal-lede">不需要追求高分，只要在 20 秒里把注意力放在眼前。点到光点后，它会换一个位置，慢慢玩一轮就好。</p>
      <div class="service-modal-section">
        <div class="service-modal-section-title"><strong>小光点练习</strong><span>20 秒互动</span></div>
        <div class="modal-game-wrap">
          <div class="modal-game-stats"><span>接住 <b data-game-score>0</b> 颗</span><span>剩余 <b data-game-time>20</b> 秒</span></div>
          <div class="modal-game-board" data-game-board><button class="modal-game-target" type="button" data-game-target hidden aria-label="接住小光点">✦</button></div>
          <button class="button button-light modal-game-start" type="button" data-service-modal-action="start-game">开始这一轮 <span aria-hidden="true">→</span></button>
          <p class="modal-game-help" data-game-status>准备好后，点击开始，让眼睛跟着光点走。</p>
        </div>
      </div>`,
    article: `
      <p class="service-modal-kicker">READ / 05 · 劳动成长科普</p>
      <h2>把劳动中的收获，<em>讲得容易一点。</em></h2>
      <p class="service-modal-lede">先从一篇文章开始，给真实经历多一个解释角度。内容围绕劳动获得感、心理资本、就业心理与经历表达持续更新。</p>
      <div class="service-modal-section">
        <div class="service-modal-section-title"><strong>现在可以阅读</strong><span>科普文章</span></div>
        <div class="modal-article-grid">
          <article class="modal-content-card"><img src="./assets/emotional-labor-cover.png" alt="情绪劳动与边界练习文章封面" /><div class="modal-content-card-body"><small>心理支持 / 劳动科普</small><h3>总在替别人兜底，为什么越做越累？</h3><p>看见安抚、解释、缓冲和收尾这些容易被漏记的情绪劳动，练习把责任放回合适的位置。</p><a href="./articles/emotional-labor/">打开文章 ↗</a></div></article>
          <article class="modal-content-card"><img src="./assets/article-experience-cover.png" alt="经历翻译四步法文章封面" /><div class="modal-content-card-body"><small>成长表达</small><h3>从“发过传单”到“能写进简历”</h3><p>把真实行动转化为可识别、可表达的能力线索。</p><a href="./articles/experience-translation/">打开文章 ↗</a></div></article>
          <article class="modal-content-card"><img src="./assets/article-ai-cover.jpg" alt="AI与成就感文章封面" /><div class="modal-content-card-body"><small>成就感与协作</small><h3>AI把活儿都干完了，为什么我反而没成就感？</h3><p>聊聊参与感、成就感和人机协作中的心理体验。</p><a href="./articles/ai-achievement/">打开文章 ↗</a></div></article>
        </div>
      </div>`,
    video: `
      <p class="service-modal-kicker">WATCH / 06 · 实践过程与科普</p>
      <h2>用一段短视频，<em>理解一段劳动成长。</em></h2>
      <p class="service-modal-lede">把实践故事、课程工具和心理科普讲得更轻一点，适合课堂分享，也适合在需要的时候暂停下来，慢慢看。</p>
      <div class="service-modal-section">
        <div class="service-modal-section-title"><strong>现在可以观看</strong><span>科普视频</span></div>
        <div class="modal-video-grid">
          <article class="modal-content-card"><video controls preload="metadata" poster="./assets/emotional-labor-cover.png"><source src="./media/emotional-labor-explainer.mp4" type="video/mp4" />当前浏览器不支持视频播放。</video><div class="modal-content-card-body"><small>心理支持</small><h3>情绪劳动：那些没写进任务清单的消耗</h3><p>从安抚、翻译到收尾，看见一边做事、一边接住别人情绪的隐形劳动。</p></div></article>
          <article class="modal-content-card"><video controls preload="metadata" poster="./assets/emotional-labor-boundary.png"><source src="./media/emotional-labor-boundary.mp4" type="video/mp4" />当前浏览器不支持视频播放。</video><div class="modal-content-card-body"><small>边界练习</small><h3>边界练习：把责任放回合适的位置</h3><p>用角色、权限和结束条件，把“我来兜底”换成清楚、可执行的表达。</p></div></article>
          <article class="modal-content-card"><video controls preload="metadata" poster="./assets/video-experience-poster.png"><source src="./media/experience-translation.mp4" type="video/mp4" />当前浏览器不支持视频播放。</video><div class="modal-content-card-body"><small>四步记录</small><h3>把经历说成能力｜四步成长记录</h3><p>把任务、行动、结果和能力，整理成一份可带走的成长证据。</p></div></article>
          <article class="modal-content-card"><video controls preload="metadata" poster="./assets/video-paper-poster.jpg"><source src="./media/experience-translation-paper.mp4" type="video/mp4" />当前浏览器不支持视频播放。</video><div class="modal-content-card-body"><small>纸片叙事</small><h3>一张纸片，讲清一段成长</h3><p>用轻巧的纸片人叙事，把经历翻译的方法讲清楚。</p></div></article>
        </div>
      </div>`,
  };

  const journeyTemplates = {
    state: `
      <p class="service-modal-kicker">STEP / 01 · 育心</p>
      <h2 id="service-modal-title">先看见劳动中的收获，<em>再把资源用起来。</em></h2>
      <p class="service-modal-lede">从一项真实劳动经历开始，辨认能力增值、价值确认，以及希望、自我效能、韧性和乐观等可以继续发展的心理资源。</p>
      <div class="service-modal-section">
        <div class="service-modal-section-title"><strong>可以留意这三件事</strong><span>先把经历说清楚</span></div>
        <div class="service-modal-list">
          <div><strong>能力</strong><small>这项劳动让你学会了什么，完成了什么以前不会的事？</small></div>
          <div><strong>价值</strong><small>谁看见了你的投入？这项经历为什么对你有意义？</small></div>
          <div><strong>资源</strong><small>你已经具备哪些力量，还需要哪一种支持继续行动？</small></div>
        </div>
        <p class="service-modal-note"><strong>给自己的提醒：</strong>劳动获得感不是给经历打分，而是把真实行动带来的成长线索留下来。</p>
      </div>
      <div class="service-modal-actions"><button class="button button-primary" type="button" data-service-modal-action="jump-assessment">进入 03 测评区 <span aria-hidden="true">→</span></button></div>`,
    method: `
      <p class="service-modal-kicker">STEP / 02 · 育能</p>
      <h2 id="service-modal-title">把方法放进真实任务，<em>练出可以迁移的能力。</em></h2>
      <p class="service-modal-lede">课程和任务不是内容堆叠，而是帮助你把目标拆开、把行动做完、把结果复盘成能力证据。</p>
      <div class="service-modal-section">
        <div class="service-modal-section-title"><strong>可以从一个能力开始</strong><span>做中学、做中练</span></div>
        <div class="service-modal-list">
          <div><strong>目标拆解</strong><small>把“想做好”变成今天可以完成的一步任务。</small></div>
          <div><strong>协作沟通</strong><small>在真实分工中表达需要、回应反馈并完成共同成果。</small></div>
          <div><strong>成果复盘</strong><small>把作品、反馈和反思整理成可表达的能力证据。</small></div>
        </div>
      </div>
      <div class="service-modal-actions"><button class="button button-primary" type="button" data-service-modal-action="jump-services">查看支持服务 <span aria-hidden="true">→</span></button></div>`,
    practice: `
      <p class="service-modal-kicker">STEP / 03 · 育志</p>
      <h2 id="service-modal-title">把经历说成职业故事，<em>让成长可以迁移。</em></h2>
      <p class="service-modal-lede">当你能说清自己做了什么、解决了什么问题、形成了什么能力，就更容易把一次劳动经历带向简历、面试和下一步就业行动。</p>
      <div class="service-modal-section">
        <div class="service-modal-section-title"><strong>一段经历可以这样整理</strong><span>从事实到行动</span></div>
        <div class="service-modal-list">
          <div><strong>事实</strong><small>写清任务、角色、投入时间和实际完成的成果。</small></div>
          <div><strong>能力</strong><small>提炼目标拆解、协作、问题解决或项目管理等能力证据。</small></div>
          <div><strong>行动</strong><small>形成一条简历要点、一个STAR故事和下一步就业行动。</small></div>
        </div>
        <p class="service-modal-note"><strong>不用夸大经历：</strong>从真实任务和可核对的成果出发，才能形成可信的职业表达。</p>
      </div>
      <div class="service-modal-actions"><button class="button button-primary" type="button" data-service-modal-action="jump-support">进入心理支持区 <span aria-hidden="true">→</span></button></div>`,
    growth: `
      <p class="service-modal-kicker">STEP / 04 · 21天任务</p>
      <h2 id="service-modal-title">让改变留下证据，<em>给未来的自己一条线索。</em></h2>
      <p class="service-modal-lede">21天劳动成长任务把测评反馈带回真实场景，记录时长、作品、反思与能力证据，让一次实践变成可以继续的成长档案。</p>
      <div class="service-modal-section">
        <div class="service-modal-section-title"><strong>每次任务可以记下三件事</strong><span>实践证据</span></div>
        <div class="service-modal-list">
          <div><strong>我完成……</strong><small>今天投入了什么任务，留下了什么作品或结果？</small></div>
          <div><strong>我学会……</strong><small>这项劳动让我看见了哪一项能力、价值或心理资源？</small></div>
          <div><strong>我继续……</strong><small>下一次想怎样调整任务，并把它带向学习或就业行动？</small></div>
        </div>
        <p class="service-modal-note"><strong>给自己的提醒：</strong>不以活动数量替代真实效果，让每项记录都回到任务、作品、反馈和下一步行动。</p>
      </div>
      <div class="service-modal-actions"><button class="button button-primary" type="button" data-service-modal-action="jump-goals">看看可以带走的内容 <span aria-hidden="true">→</span></button></div>`,
  };

  const stopGame = (message) => {
    if (gameTimer) window.clearInterval(gameTimer);
    gameTimer = null;
    const target = serviceModal?.querySelector('[data-game-target]');
    if (target) target.hidden = true;
    const status = serviceModal?.querySelector('[data-game-status]');
    if (status && message) status.textContent = message;
  };

  const updateGameStats = () => {
    const score = serviceModal?.querySelector('[data-game-score]');
    const time = serviceModal?.querySelector('[data-game-time]');
    if (score) score.textContent = String(gameScore);
    if (time) time.textContent = String(gameTime);
  };

  const moveGameTarget = () => {
    const board = serviceModal?.querySelector('[data-game-board]');
    const target = serviceModal?.querySelector('[data-game-target]');
    if (!board || !target) return;
    const x = 30 + Math.random() * Math.max(1, board.clientWidth - 60);
    const y = 30 + Math.random() * Math.max(1, board.clientHeight - 60);
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
  };

  const startGame = () => {
    stopGame();
    gameScore = 0;
    gameTime = 20;
    updateGameStats();
    const target = serviceModal?.querySelector('[data-game-target]');
    const status = serviceModal?.querySelector('[data-game-status]');
    const startButton = serviceModal?.querySelector('[data-service-modal-action="start-game"]');
    if (!target || !status || !startButton) return;
    target.hidden = false;
    startButton.textContent = '重新开始这一轮 →';
    status.textContent = '慢慢找，不用急。';
    moveGameTarget();
    gameTimer = window.setInterval(() => {
      gameTime -= 1;
      updateGameStats();
      if (gameTime <= 0) stopGame(`这一轮完成：接住了 ${gameScore} 颗光点。先休息一下，也可以再来一轮。`);
    }, 1000);
  };

  const openModalContent = (content, trigger) => {
    if (!serviceModal || !serviceModalContent || !content) return;
    stopGame();
    serviceReturnFocus = trigger;
    serviceModalContent.innerHTML = content;
    serviceModal.hidden = false;
    document.body.style.overflow = 'hidden';
    serviceModal.querySelector('.service-modal-close')?.focus();
  };

  const openServiceModal = (type, trigger) => openModalContent(serviceTemplates[type], trigger);
  const openJourneyModal = (type, trigger) => openModalContent(journeyTemplates[type], trigger);

  const closeServiceModal = () => {
    if (!serviceModal || serviceModal.hidden) return;
    stopGame();
    serviceModal.hidden = true;
    serviceModalContent.innerHTML = '';
    document.body.style.overflow = '';
    serviceReturnFocus?.focus();
    serviceReturnFocus = null;
  };

  document.querySelectorAll('[data-service-open]').forEach((button) => {
    button.addEventListener('click', () => openServiceModal(button.dataset.serviceOpen, button));
  });

  document.querySelectorAll('[data-journey-open]').forEach((button) => {
    button.addEventListener('click', () => openJourneyModal(button.dataset.journeyOpen, button));
  });

  serviceModal?.addEventListener('click', (event) => {
    if (event.target.closest('[data-service-close]')) {
      closeServiceModal();
      return;
    }

    const moodButton = event.target.closest('[data-modal-mood]');
    if (moodButton) {
      serviceModal.querySelectorAll('[data-modal-mood]').forEach((button) => button.classList.toggle('is-selected', button === moodButton));
      const response = serviceModal.querySelector('[data-modal-support-response]');
      const responses = {
        '有点累': '先从 8 分钟放松开始：把肩膀放下来，给自己一小段不需要完成任务的时间。',
        '压力中': '先把压力写成三件具体的事，再挑一件今天只做第一步，不必一次解决全部。',
        '说不清': '说不清也没有关系。你可以先做测评，或找一个愿意听你说的人陪你把感受慢慢理出来。',
        '还不错': '很好，也可以把这份稳定记录下来，留给之后需要提醒自己的时候。',
      };
      if (response) response.textContent = responses[moodButton.dataset.modalMood];
      return;
    }

    const courseToggle = event.target.closest('[data-course-toggle]');
    if (courseToggle) {
      const card = courseToggle.closest('.modal-course-card');
      const isOpen = card?.classList.toggle('is-open');
      courseToggle.textContent = isOpen ? '收起练习' : '展开练习';
      return;
    }

    const target = event.target.closest('[data-game-target]');
    if (target && gameTimer) {
      gameScore += 1;
      updateGameStats();
      moveGameTarget();
      return;
    }

    const action = event.target.closest('[data-service-modal-action]')?.dataset.serviceModalAction;
    if (action === 'jump-assessment') {
      closeServiceModal();
      document.querySelector('#assessment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'jump-services') {
      closeServiceModal();
      document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'jump-support') {
      closeServiceModal();
      document.querySelector('#support')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'jump-goals') {
      closeServiceModal();
      document.querySelector('#goals')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (action === 'start-game') {
      startGame();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && serviceModal && !serviceModal.hidden) closeServiceModal();
  });

  renderSocialPlatforms();
  renderSocialFeed();
  renderAssessment();
  renderSupport();

  document.querySelectorAll('[data-copy-template]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(template);
          showToast('成长行动清单已复制，可以从真实劳动开始。');
        } catch {
          showToast('复制未完成，请手动记下：经历、能力、行动、支持与证据。');
        }
    });
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
})();
