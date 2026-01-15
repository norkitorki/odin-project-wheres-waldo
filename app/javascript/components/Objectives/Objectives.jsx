import React, { useRef } from 'react';
import styles from '@stylesheets/Objectives.module.css';
import { SuccessIcon } from '@javascript/components/Icons/Icons';

const TriggerButton = ({ itemType, ref }) => {
  const onClick = (event) => {
    const trigger = event.target;
    const toggle = ref.current?.classList.toggle(styles.objectivesShown);
    const status = toggle ? 'Hide' : 'Show';

    trigger.classList.toggle(styles.active);
    trigger.textContent = `${status} ${itemType}`;
    trigger.title = `${status} current ${itemType}`;
  };

  return (
    <button
      className={styles.trigger}
      onClick={onClick}
      data-type={itemType}
      title={`Show findable ${itemType}`}
    >
      Show {itemType}
    </button>
  );
};

const listItems = (findables, discoveries) => {
  return findables.map((element) => {
    const [findable, index] = element;
    return (
      <li key={findable.name} className={styles.item} title={findable.name}>
        <img src={findable.image} />
        <p>{findable.name}</p>
        {discoveries.toArray[index] && <SuccessIcon />}
      </li>
    );
  });
};

export default function Objectives({ findables, discoveries }) {
  const charactersRef = useRef();
  const itemsRef = useRef();

  const characters = [];
  const items = [];

  findables.forEach((f, index) =>
    f.type_of === 'item' ? items.push([f, index]) : characters.push([f, index])
  );

  const charactersToRender = listItems(characters, discoveries);
  const itemsToRender = listItems(items, discoveries);

  return (
    <>
      <TriggerButton itemType="Characters" ref={charactersRef} />
      <TriggerButton itemType="Items" ref={itemsRef} />
      <div className={styles.objectives} ref={charactersRef}>
        <ul>{charactersToRender}</ul>
      </div>
      <div className={styles.objectives} ref={itemsRef}>
        <ul>{itemsToRender}</ul>
      </div>
    </>
  );
}
