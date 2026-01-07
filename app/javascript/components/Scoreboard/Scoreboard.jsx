import React, { useState, useEffect } from 'react';
import styles from '@stylesheets/Scoreboard.module.css';
import { mapImages } from '../../mapImages';

const pageLimit = 25;

export default function Scoreboard({ map, personalBest, initialPage }) {
  const [page, setPage] = useState(initialPage);
  const [scores, setScores] = useState();

  useEffect(() => {
    fetch(`/scores?map_id=${map.id}&page=${page}`)
      .then((res) => res.json())
      .then((data) => setScores(data));
  }, []);

  if (scores) {
    const updatePage = (event) => {
      const nextPage = Number(event.target.value);
      if (nextPage > 0 && nextPage <= pageCount) setPage(nextPage);
    };

    const pageCount = Math.ceil(scores.length / pageLimit);
    const scoresPerPage = scores.slice(
      page * pageLimit - pageLimit,
      page * pageLimit
    );
    const scoresFrom = 1 + page * pageLimit - pageLimit;
    const scoresTo = scoresFrom + scoresPerPage.length - 1;

    return (
      <>
        <div
          className={styles.imageContainer}
          style={{
            background: `no-repeat center url('${
              mapImages[map.name.toLowerCase()]
            }')`,
          }}
        >
          <section className={styles.container}>
            <h1>
              <span className={styles.mapName}>{map.name}</span> Highscores
            </h1>
            {personalBest && <h2>Your Personal Best: {personalBest.value}</h2>}
            {scores.length > pageLimit && (
              <div className={styles.pagination}>
                <span>
                  Page{' '}
                  <input
                    type="number"
                    min="1"
                    max={pageCount}
                    value={page}
                    onChange={updatePage}
                  />{' '}
                </span>
                <span>
                  Showing {scoresFrom} to {scoresTo} | Score{' '}
                  {scoresPerPage[0].value} - {scoresPerPage.slice(-1)[0].value}
                </span>
              </div>
            )}
            <div className={styles.scores}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>User</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scoresPerPage.map((score, index) => (
                    <tr key={index}>
                      <td>{score.pos}</td>
                      <td>{score.created}</td>
                      <td
                        className={
                          personalBest && score.user.id === personalBest.user_id
                            ? styles.userScore
                            : ''
                        }
                      >
                        {score.user.name}
                      </td>
                      <td>{score.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </>
    );
  }
}
