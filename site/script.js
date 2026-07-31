(() => {
  const toast = document.querySelector('[data-toast]');
  const template = `劳有心获成长局·自我照顾清单\n\n我最近的状态：……\n我想先了解的方向：测评 / 心理支持 / 干预课程 / 解压游戏 / 科普内容\n我愿意为自己做的一件小事：……\n我需要联系的支持对象：……\n我想留下的变化：……`;
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

    channels.innerHTML = platforms.map((platform) => `<article class="channel-card"><div class="channel-copy"><span class="channel-platform">${escapeHtml(platform.platform)}</span><strong>${escapeHtml(platform.account)}</strong><small>${escapeHtml(platform.note)}</small><span class="channel-handle">${escapeHtml(platform.handle)}</span></div><img src="${escapeHtml(platform.image)}" alt="${escapeHtml(platform.platform)}账号入口二维码" loading="lazy" /></article>`).join('');
  };

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
  };

  const assessmentTypes = [
    { name: '近期状态', note: '了解这段时间的情绪与压力', time: '约 3 分钟' },
    { name: '学习与生活', note: '看看精力、睡眠和节奏是否平衡', time: '约 5 分钟' },
    { name: '支持需求', note: '找到你现在最需要的陪伴方式', time: '约 3 分钟' },
  ];
  const assessmentQuestions = [
    {
      prompt: '最近一周，你有多常觉得事情压在一起？',
      options: [{ label: '很少', value: 0 }, { label: '偶尔', value: 1 }, { label: '经常', value: 2 }],
    },
    {
      prompt: '当你感到压力时，通常能找到让自己缓一缓的方法吗？',
      options: [{ label: '可以找到', value: 0 }, { label: '有时可以', value: 1 }, { label: '还没有', value: 2 }],
    },
    {
      prompt: '此刻你最希望得到哪一种帮助？',
      options: [{ label: '知道发生了什么', value: 0 }, { label: '学一个具体方法', value: 1 }, { label: '有人陪我聊聊', value: 2 }],
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
        title: '你正在照顾好自己的节奏',
        copy: '继续保持对状态的觉察，也可以把本次测评当作一个轻量的记录，过一段时间再回来看看。',
      };
    }
    if (score >= 5) {
      return {
        title: '最近可能需要更多支持',
        copy: '你不必独自扛着。建议先选择支持区中的放松练习或求助指引，也可以和身边信任的人说一说。',
      };
    }
    return {
      title: '你的状态有一些紧绷',
      copy: '可以先从一段短时放松开始，再选择一篇科普或一堂课程。给自己一点缓冲，不必马上解决全部问题。',
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
    { name: '学一个方法', note: '结构化课程与行动建议' },
    { name: '找人聊聊', note: '支持资源与求助指引' },
  ];
  const supportCourses = [
    { title: '把压力放在桌面上', note: '识别压力来源，练习拆解当下', duration: '12 分钟', tag: '干预课程' },
    { title: '睡前给大脑留白', note: '一套适合夜晚的放松练习', duration: '8 分钟', tag: '睡眠支持' },
  ];
  const supportState = { selectedMood: -1, selectedSupport: 0, gameStarted: false };

  const renderSupport = () => {
    const app = document.querySelector('[data-support-app]');
    if (!app) return;

    const game = supportState.gameStarted
      ? `<div class="support-game support-game-playing"><div class="breath-orbit" aria-hidden="true"><div class="breath-core"></div></div><strong>跟着圆点，慢慢吸气，再慢慢呼气。</strong><small>不需要做到完美，只要把注意力带回来。</small><button type="button" class="experience-button experience-button-gold" data-support-action="finish-game">完成这一轮</button></div>`
      : `<button type="button" class="support-game support-game-entry" data-support-action="start-game"><span class="game-circle">PLAY</span><span><strong>十分钟解压游戏</strong><small>把注意力带回当下，轻轻玩一会儿。</small></span><b aria-hidden="true">进入 →</b></button>`;

    app.innerHTML = `<div class="support-question">此刻的我……</div><div class="mood-list">${supportMoods.map((mood, index) => `<button type="button" class="mood-chip ${supportState.selectedMood === index ? 'is-selected' : ''}" data-support-mood="${index}" aria-pressed="${supportState.selectedMood === index}">${escapeHtml(mood)}</button>`).join('')}</div><div class="support-subheading"><span>A SMALL STEP</span><strong>想先试试什么？</strong></div><div class="support-option-list">${supportTypes.map((type, index) => `<button type="button" class="support-option ${supportState.selectedSupport === index ? 'is-selected' : ''}" data-support-type="${index}" aria-pressed="${supportState.selectedSupport === index}"><span>0${index + 1}</span><span><strong>${escapeHtml(type.name)}</strong><small>${escapeHtml(type.note)}</small></span><b aria-hidden="true">→</b></button>`).join('')}</div><div class="support-subheading support-course-heading"><span>COURSE / GAME</span><strong>给今天的自己一点空间</strong></div><div class="support-course-list">${supportCourses.map((course) => `<button type="button" class="support-course" data-support-course="${escapeHtml(course.title)}"><span>${escapeHtml(course.tag)}</span><strong>${escapeHtml(course.title)}</strong><small>${escapeHtml(course.note)}</small><em>${escapeHtml(course.duration)} <b>开始 →</b></em></button>`).join('')}${game}</div><div class="support-safety"><strong>需要更及时的帮助？</strong><p>本项目提供的是日常支持与健康科普，不代替诊断和治疗。如果情况紧急，请优先联系身边的人或专业机构。</p><button type="button" data-support-action="safety">查看求助提醒</button></div>`;
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

  renderSocialPlatforms();
  renderSocialFeed();
  renderAssessment();
  renderSupport();

  document.querySelectorAll('[data-copy-template]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(template);
          showToast('自我照顾清单已复制，可以从了解自己开始。');
        } catch {
          showToast('复制未完成，请手动记下：状态、支持、小步行动。');
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
