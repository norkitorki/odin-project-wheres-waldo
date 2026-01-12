import React, { useEffect, useState, useRef } from 'react';
import styles from '@stylesheets/WinningScreen.module.css';
import icons from '@javascript/components/Icons/Icons';
import { Form, SubmitButton, TextField } from '@javascript/components/Inputs';
import { _fetch } from '@javascript/utils.js';

const Highlight = ({ textContent }) => {
  return <span className={styles.highlighted}>{textContent}</span>;
};

export default function WinningScreen({ map, discoveries, newUser }) {
  const [score, setScore] = useState(null);
  const [rankings, setRankings] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    (async () => {
      const response = await _fetch('/score', 'GET');
      const score = await response.json();

      if (
        (score && score.best && score.value > score.best) ||
        (score && !score.best && !newUser)
      ) {
        await _fetch('/scores', 'POST');
      }

      await _fetch(
        `/scores?map_id=${map.id}&page=1&per_page=10`,
        'GET',
        (rankings) => setRankings(rankings)
      );

      setScore(score);
    })();
  }, []);

  const reset = async () => {
    await _fetch('/score', 'DELETE');
    discoveries.reset();
  };

  if (score) {
    inputRef.current?.focus();

    return (
      <div className={styles.container}>
        <h2>Congratulations!</h2>
        <p>
          {score.best && score.value > score.best ? (
            <>
              You beat your previous high score of{' '}
              <Highlight textContent={score.best} /> with a score of{' '}
              <Highlight textContent={score.value} />
            </>
          ) : (
            <>
              You've cleared the map with a score of{' '}
              <Highlight textContent={score.value} />
            </>
          )}
        </p>
        {newUser ? (
          <Form
            {...newUser.form.form}
            extras={newUser.form.extras}
            validationErrors={newUser.form.errors}
            className={styles.form}
            data-sg-visit
          >
            <TextField
              {...newUser.form.inputs.name}
              label={'Enter your name to save your result'}
              placeholder={'Your Name Here'}
              ref={inputRef}
              autoFocus
            />
            <SubmitButton
              {...newUser.form.inputs.submit}
              type="submit"
              className={styles.submitButton}
            />
            {newUser.formErrors && (
              <div className={styles.formErrors}>
                {newUser.formErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </Form>
        ) : (
          <>
            <table className={styles.rankings}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((score) => (
                  <tr key={score.pos}>
                    <td>{score.pos}</td>
                    <td>{score.user.name}</td>
                    <td>{score.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <div>
          <button className={styles.button} title="Replay Map" onClick={reset}>
            <icons.Replay />
            <span>Replay</span>
          </button>
          <a
            href="/"
            className={styles.button}
            title="Return Home"
            data-sg-visit
          >
            <icons.Home />
            <span>Home</span>
          </a>
          <a
            href={`/scoreboard/${map.id}`}
            className={styles.button}
            title="Show Map Scores"
            data-sg-visit
          >
            <icons.Scores />
            <span>Map Scores</span>
          </a>
        </div>
      </div>
    );
  }
}
