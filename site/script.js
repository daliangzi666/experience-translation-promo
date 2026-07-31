(() => {
  const toast = document.querySelector('[data-toast]');
  const template = `就业成长自我梳理清单\n\n我当前的就业困惑：……\n我的兴趣、优势与价值取向：……\n我想探索的职业图景 / 目标岗位：……\n我需要补足的能力与实践：……\n我准备推进的生涯行动路径：……\n我需要的就业适配心理支持：……`;
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
        : `<span class="feed-link feed-link-muted">账号内容 <span aria-hidden="true">✦</span></span>`;
      return `<article class="feed-card feed-${escapeHtml(item.type)}">${media}<div class="feed-body"><div class="feed-meta"><span>${escapeHtml(item.category)}</span><time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.excerpt)}</p>${action}</div></article>`;
    }).join('');
  };

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
        showToast('就业成长清单已复制，可以从自我觉察开始。');
      } catch {
        showToast('复制未完成，请手动记下：困惑、优势、职业图景、行动路径。');
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
