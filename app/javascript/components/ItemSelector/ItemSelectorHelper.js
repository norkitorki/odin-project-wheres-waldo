let timeoutId;

export const preventSelectorOverflow = (selector) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  const transitionDelay = Number(
    getComputedStyle(selector)['transition-duration'].match(/[^a-z]+/i) * 1000,
  );

  timeoutId = setTimeout(() => {
    const rect = selector.getBoundingClientRect();
    const overflowBottom = rect.height + rect.top > innerHeight;
    const overflowRight = rect.width + rect.left > innerWidth;

    if (overflowBottom) {
      const diff = rect.height - (innerHeight - rect.top);
      selector.style.top = `${selector.style.top.slice(0, -2) - diff - 28.5}px`;
    }
    if (overflowRight) {
      const diff = rect.width - (innerWidth - rect.left);
      selector.style.left = `${selector.style.left.slice(0, -2) - diff - 40.5}px`;
    }
  }, transitionDelay);
};
