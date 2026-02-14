import React, { useRef } from 'react';
import styles from '@stylesheets/Objectives.module.css';
import { SuccessIcon } from '@javascript/components/Icons/Icons';

const TriggerButton = ({ itemType, activeRef, inactiveRef }) => {
  const onClick = () => {
    inactiveRef.current?.classList.remove(styles.objectivesShown);
    activeRef.current?.classList.toggle(styles.objectivesShown);
  };

  return (
    <button
      className={styles.trigger}
      title={`Toggle findable ${itemType}`}
      onClick={onClick}
    >
      Toggle {itemType}
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
    f.type_of === 'item' ? items.push([f, index]) : characters.push([f, index]),
  );

  const charactersToRender = listItems(characters, discoveries);
  const itemsToRender = listItems(items, discoveries);

  return (
    <>
      <TriggerButton
        itemType="Characters"
        activeRef={charactersRef}
        inactiveRef={itemsRef}
      />
      <TriggerButton
        itemType="Items"
        activeRef={itemsRef}
        inactiveRef={charactersRef}
      />
      <div
        className={styles.objectives}
        ref={charactersRef}
        data-testid="character-objectives"
      >
        <ul>{charactersToRender}</ul>
      </div>
      <div
        className={styles.objectives}
        ref={itemsRef}
        data-testid="item-objectives"
      >
        <ul>{itemsToRender}</ul>
      </div>
    </>
  );
}
