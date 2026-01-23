import React, { useRef, useState, useEffect } from 'react';
import styles from '@stylesheets/ImageFrame.module.css';
import ItemSelector from '@javascript/components/ItemSelector/ItemSelector';
import Objectives from '@javascript/components/Objectives/Objectives';
import MessageBoard from '@javascript/components/MessageBoard/MessageBoard';
import WinningScreen from '@javascript/components/WinningScreen/WinningScreen';
import Navigation from '@javascript/components/Navigation/Navigation';
import { sendMessage } from '@javascript/components/MessageBoard/MessageBoardHelper';
import { _fetch } from '@javascript/utils';
import {
  constructMessage,
  fetchItem,
  findCoordinates,
  missedClick,
  setMarker,
} from '@javascript/components/ImageFrame/ImageFrameHelper';

export default function ImageFrame({ map, findables, image, newUser }) {
  const [discoveries, setDiscoveries] = useState({
    count: 0,
    toArray: Array(findables.length),
    reset: function () {
      document.querySelectorAll('.itemMarker').forEach((el) => el.remove());
      setDiscoveries({
        ...discoveries,
        count: 0,
        toArray: Array(findables.length),
      });
    },
  });

  useEffect(
    () => () => {
      _fetch('/game_sessions', 'DELETE');
      discoveries.reset();
    },
    [],
  );

  const imageRef = useRef();
  const cirlceRef = useRef();
  const contextMenuRef = useRef();
  const itemModalRef = useRef();

  let coordinates, dragEvent;

  const onDragStart = (event) => (dragEvent = event);

  const onDrag = (event) => {
    if (event.screenX > 0 && event.screenY > 0) {
      scroll(
        dragEvent.clientX - event.clientX,
        dragEvent.clientY - event.clientY,
      );
    }
  };

  const onClick = (event) => {
    const { pageX, pageY } = event;

    contextMenuRef.current?.setAttribute(
      'style',
      `display: flex; left: ${pageX + 7.5}px; top: ${pageY + 7.5}px;`,
    );

    cirlceRef.current?.setAttribute(
      'style',
      `display: block; left: ${pageX - 10.83}px ; top: ${pageY - 10.83}px;`,
    );

    coordinates = findCoordinates(event, imageRef.current, findables);
  };

  const onMenuClick = async (_, itemIndex) => {
    if (!itemIndex) return;

    contextMenuRef.current.style.display = 'none';
    const item = findables[itemIndex];
    const clickedItem = await fetchItem(map, item, coordinates);

    if (clickedItem?.name === item.name) {
      setMarker(cirlceRef.current, item, itemModalRef.current);
      setDiscoveries((state) => {
        const newState = { ...state };
        newState.count++;
        newState.toArray[itemIndex] = item;
        return newState;
      });
    } else {
      missedClick(cirlceRef.current);
    }

    sendMessage(
      constructMessage(
        item,
        `${item.name} ${clickedItem?.name === item.name ? '' : 'not'} found!`,
      ),
      5,
    );
  };

  return (
    <>
      <Navigation
        links={[
          { url: '/', content: 'Home' },
          { url: `/scoreboard/${map.id}`, content: 'Map Scores' },
          {
            content: (
              <Objectives findables={findables} discoveries={discoveries} />
            ),
          },
        ]}
      />
      <MessageBoard />
      <img
        src={image}
        className={styles.image}
        onClick={
          discoveries.count >= discoveries.toArray.length ? null : onClick
        }
        onDrag={onDrag}
        onDragStart={onDragStart}
        ref={imageRef}
        data-testid="main-image"
      />
      {discoveries.count < discoveries.toArray.length ? (
        <>
          <div
            className={styles.targetCircle}
            onClick={onClick}
            ref={cirlceRef}
            data-testid="target-circle"
          />
          <ItemSelector
            findables={findables}
            discoveries={discoveries}
            onClick={onMenuClick}
            ref={contextMenuRef}
          />
        </>
      ) : (
        <WinningScreen map={map} discoveries={discoveries} newUser={newUser} />
      )}
      <div className={styles.modal} ref={itemModalRef} />
    </>
  );
}
