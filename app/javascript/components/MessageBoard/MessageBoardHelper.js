import styles from '@stylesheets/MessageBoard.module.css';

let timeoutId;

export const sendMessage = (content, delay = 0) => {
  const container = document.querySelector('[data-messages]')
  if (!container) return;

  if (content instanceof Element) {
    while (container.lastChild) container.removeChild(container.lastChild);
    container.appendChild(content);
  } else {
    container.textContent = content;
  }

  if (delay > 0) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      container.classList.remove(styles.visible);
      container.textContent = '';
    }, delay * 1000);
  }

  container.classList.add(styles.visible);
};
