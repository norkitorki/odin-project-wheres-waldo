import React from 'react';
import styles from '@stylesheets/ItemSelector.module.css';

export default function ItemSelector({ findables, discoveries, onClick, ref }) {
  const clickCallback = (event) => {
    onClick(event, event.target.dataset['itemIndex']);
  };

  let characters = [];
  let items = [];

  findables.forEach((findable, index) => {
    let arr = index < 5 ? characters : items;
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

  /*
  const displayedItems = findables.map((item, index) =>
    discoveries.toArray[index] ? null : (
      <button
        key={item.name}
        className={styles.button}
        data-item-index={index}
        title={item.name}
      >
        <img
          src={item.image}
          alt={`${item.name} portrait`}
          data-item-index={index}
        />
      </button>
    )
  );
  */
  return (
    <div className={styles.container} onClick={clickCallback} ref={ref}>
      <div className={styles.characters}>{characters}</div>
      <div className={styles.items}>{items}</div>
    </div>
  );
}
