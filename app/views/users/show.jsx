import React from 'react';
import { Layout } from '@javascript/components';
import { useContent } from '@thoughtbot/superglue';
import UserHome from '@javascript/components/UserHome/UserHome';

export default function UserShow() {
  const { user, scores, deleteForm } = useContent();

  return (
    <Layout>
      <UserHome user={user} scores={scores} deleteForm={deleteForm} />
    </Layout>
  );
}
