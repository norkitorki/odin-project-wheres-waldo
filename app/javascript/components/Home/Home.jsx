import React from 'react';
import styles from '@stylesheets/Home.module.css';
import waldoImage from '@images/waldo.png';
import { mapPreviews } from '@javascript/mapImages';
import { ScoresIcon, PlayIcon } from '../Icons/Icons';

export default function Home({ maps }) {
  return (
    <>
      <div className={styles.headerContainer}>
        <img src={waldoImage} />
        <h1>
          Where's <span>Waldo?</span>
        </h1>
      </div>
      <ul className={styles.container}>
        {maps.map((map) => (
          <li key={map.id}>
            <div className={styles.imageContainer}>
              <img src={mapPreviews[map.name.toLowerCase()]} alt={map.name} />
              <div className={styles.links}>
                <a href={map.mapPath} title={`Play ${map.name}`} data-sg-visit>
                  <span>
                    <PlayIcon />
                    Play
                  </span>
                </a>
                <a
                  href={map.scoresPath}
                  title={`Show ${map.name} scores`}
                  data-sg-visit
                >
                  <span>
                    <ScoresIcon />
                    Scores
                  </span>
                </a>
              </div>
            </div>
            <h2>{map.name}</h2>
          </li>
        ))}
      </ul>
    </>
  );
}
