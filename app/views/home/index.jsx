import React from 'react';
import { Layout } from '@javascript/components';
import { useContent } from '@thoughtbot/superglue';
import Navigation from '@javascript/components/Navigation/Navigation';
import Home from '@javascript/components/Home/Home';

export default function HomeIndex() {
  const { maps } = useContent();

  return (
    <Layout>
      <Navigation />
      <Home maps={maps} />
    </Layout>
  );
}
