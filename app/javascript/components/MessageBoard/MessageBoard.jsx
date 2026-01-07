import React from 'react';
import styles from '@stylesheets/MessageBoard.module.css';

export default function MessageBoard({ message }) {
  return (
    <div className={styles.messageBoard} data-messages>
      {message}
    </div>
  );
}
