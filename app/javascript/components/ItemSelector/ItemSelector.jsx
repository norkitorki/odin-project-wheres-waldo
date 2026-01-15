import React from 'react';
import styles from '@stylesheets/ItemSelector.module.css';

export default function ItemSelector({ findables, discoveries, onClick, ref }) {
  const clickCallback = (event) => {
    onClick(event, event.target.dataset['itemIndex']);
  };

  const characters = [];
  const items = [];

  findables.forEach((findable, index) => {
    let arr = findable.type_of === 'item' ? items : characters;
    if (discoveries.toArray[index]) {
      arr.push(null);
    } else {
      arr.push(
        <button
          key={findable.name}
          className={styles.button}
          data-item-index={index}
          title={findable.name}
        >
          <img
            src={findable.image}
            alt={`${findable.name} portrait`}
            data-item-index={index}
          />
        </button>
      );
    }
  });

  return (
    <div className={styles.container} onClick={clickCallback} ref={ref}>
      <div className={styles.characters}>{characters}</div>
      <div className={styles.items}>{items}</div>
    </div>
  );
}
