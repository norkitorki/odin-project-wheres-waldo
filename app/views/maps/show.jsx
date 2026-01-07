import React from 'react';
import findableImages from '@javascript/findableImages.js';
import ImageFrame from '@javascript/components/ImageFrame/ImageFrame';
import { useContent } from '@thoughtbot/superglue';
import { mapImages } from '@javascript/mapImages';
import { Layout } from '@javascript/components';

export default function MapShow() {
  const { map, findables, newUser } = useContent();

  const mapImage = mapImages[map.name.toLowerCase()];
  const findablesWithImages = findables.map((findable) => ({
    ...findable,
    image: findableImages[findable.name.toLowerCase()],
  }));

  return (
    <Layout>
      <ImageFrame
        map={map}
        findables={findablesWithImages}
        image={mapImage}
        newUser={newUser}
      />
    </Layout>
  );
}
