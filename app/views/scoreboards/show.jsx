import React from 'react';
import Scoreboard from '@javascript/components/Scoreboard/Scoreboard';
import { useContent } from '@thoughtbot/superglue';
import { Layout } from '@javascript/components';
import Navigation from '@javascript/components/Navigation/Navigation';

export default function ScoreboardShow() {
  const { map, page, personalBest } = useContent();

  return (
    <Layout>
      <Navigation
        links={[
          { url: '/', content: 'Home' },
          { url: `/maps/${map.id}`, content: 'Play Map' },
        ]}
      />
      <Scoreboard map={map} personalBest={personalBest} initialPage={page} />
    </Layout>
  );
}
