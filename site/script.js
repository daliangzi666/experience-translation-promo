(() => {
  const toast = document.querySelector('[data-toast]');
  const template = `成长支持体验清单\n\n我现在最需要：了解自己 / 缓解压力 / 学习方法 / 持续支持\n我想先体验：测评 / 心理支持 / 干预课程 / 解压游戏 / 科普文章 / 科普视频\n我准备做的第一步：……\n我希望留下的变化：……`;
  let toastTimer;

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
        showToast('体验清单已复制，选择一个入口开始吧。');
      } catch {
        showToast('复制未完成，请手动记下：需要什么、先体验什么、下一步做什么。');
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
