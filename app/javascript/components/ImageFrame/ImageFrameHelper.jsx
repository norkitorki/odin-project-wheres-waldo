import styles from '@stylesheets/ImageFrame.module.css';

export const findCoordinates = (event, image, items) => {
  if (!event || !image || !items) return null;

  const { pageX, pageY } = event;
  const rect = image.getBoundingClientRect();
  const imageXPercent = ((pageX - rect.x - scrollX) / rect.width) * 100;
  const imageYPercent = ((pageY - rect.y - scrollY) / rect.height) * 100;

  return { x: imageXPercent, y: imageYPercent };
};

export const fetchItem = async (map, item, coordinates) => {
  const { x, y } = coordinates;
  const params = `map_id=${map.id}&name=${item.name}&x=${x}&y=${y}`;
  const response = await fetch(`/findable?${params}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return await response.json();
};

export const setMarker = (targetCircle, item, modal) => {
  const marker = targetCircle.cloneNode(true);
  marker.classList.value = `${styles.itemMarker} itemMarker`;
  marker.setAttribute('style', targetCircle.getAttribute('style'));
  marker.addEventListener('mouseenter', (event) => {
    marker.addEventListener('mouseout', () => (modal.style.display = 'none'));
    modal.textContent = `${item.name} was found here`;
    modal.style.display = 'block';
    modal.style.left = `${event.pageX + 5}px`;
    modal.style.top = `${event.pageY + 5}px`;
  });

  document.body.appendChild(marker);
  targetCircle.style.display = 'none';
};

export const constructMessage = (item, message) => {
  const div = document.createElement('div');
  const p = document.createElement('p');
  p.textContent = message;

  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.height = '40';
    div.appendChild(img);
  }

  div.classList.add(styles.message);
  div.appendChild(p);
  return div;
};

export const missedClick = (targetCircle) => {
  setTimeout(() => targetCircle.classList.remove(styles.missedClick), 500);

  targetCircle.classList.add(styles.missedClick);
};
