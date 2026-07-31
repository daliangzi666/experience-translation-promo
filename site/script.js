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

  renderSocialPlatforms();
  renderSocialFeed();

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
  };

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
