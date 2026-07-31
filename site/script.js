(() => {
  const toast = document.querySelector('[data-toast]');
  const template = `经历翻译四格练习\n\n任务：我负责……\n行动：我通过……\n结果：最后……\n能力：这说明我能……`;
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
        showToast('四格模板已复制，找一件小事开始吧。');
      } catch {
        showToast('复制未完成，请手动记下：任务、行动、结果、能力。');
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
