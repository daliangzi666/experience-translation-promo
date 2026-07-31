(() => {
  const toast = document.querySelector('[data-toast]');
  const template = `就业成长自我梳理清单\n\n我当前的就业困惑：……\n我的兴趣、优势与价值取向：……\n我想探索的职业图景 / 目标岗位：……\n我需要补足的能力与实践：……\n我准备推进的生涯行动路径：……\n我需要的就业适配心理支持：……`;
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
