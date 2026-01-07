import React from 'react';
import Navigation from '../Navigation/Navigation';
import styles from '@stylesheets/UserHome.module.css';
import { Form, SubmitButton } from '../Inputs';
import { mapPreviews } from '../../mapImages';

export default function UserHome({ user, scores, deleteForm }) {
  const newUser = new URLSearchParams(location.search).get('new_user');

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(user.token);
      alert('User token has been copied to your clipboard');
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDeletion = (event) => {
    const confirmation = confirm(
      'You are about to delete your user including their scores. Are you sure?'
    );
    if (!confirmation) event.preventDefault();
  };

  const userScores = scores.map((score) => {
    const mapName = score.map.name;
    return (
      <li key={mapName}>
        <img src={mapPreviews[mapName.toLowerCase()]} />
        <p>
          <a
            href={`/maps/${score.map.id}`}
            className={styles.mapLink}
            data-sg-visit
          >
            Play
          </a>
          <a
            href={`/scoreboard/${score.map.id}`}
            className={styles.scoreLink}
            data-sg-visit
          >
            Scores
          </a>
        </p>
        <p>{mapName}</p>
        <p>Best Score: {score.value}</p>
      </li>
    );
  });

  const userDeleteForm = (
    <Form
      {...deleteForm.form}
      extras={deleteForm.extras}
      className={styles.deleteForm}
      onSubmit={confirmDeletion}
    >
      <SubmitButton
        {...deleteForm.inputs.submit}
        type="submit"
        className={styles.deleteButton}
        title="Delete current user"
      />
    </Form>
  );

  return (
    <>
      <Navigation links={[{ url: '/', content: 'Home' }]} />
      <h1 className={styles.heading}>
        Welcome back <span>{user.name}</span>!
      </h1>

      <label className={styles.userToken}>
        {newUser && (
          <p className={styles.tokenWarning}>
            <span>Attention!</span> Please backup your user token before terminating the
            current session. Without the token, you won't be able to recover
            your account in the future.
          </p>
        )}
        Token <input type="text" value={user.token} disabled />
        <button onClick={copyToken}>Copy</button>
      </label>

      {userDeleteForm}

      <h3 className={styles.heading}>Your Scores</h3>
      <ul className={styles.scores}>{userScores}</ul>
    </>
  );
}
