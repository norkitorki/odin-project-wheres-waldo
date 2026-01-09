import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import ImageFrame from '@javascript/components/ImageFrame/ImageFrame';
import { mapImages } from '@javascript/mapImages';

// Mocking superglue redux store implementation
vi.mock(import('@thoughtbot/superglue'), () => ({
  useContent: () => ({ currentUser: { name: 'test' } }),
}));

vi.mock(import('@javascript/components/Navigation/Navigation'), () => ({
  default: () => <button>Show navigation menu</button>,
}));

vi.mock(import('@javascript/components/WinningScreen/WinningScreen'), () => ({
  default: () => null,
}));

vi.mock(import('@javascript/utils'), () => ({
  _fetch: () => vi.fn(),
}));

const props = {
  map: { name: 'Waldo Test Playground' },
  findables: [{ name: 'Waldo' }, { name: 'Wenda' }],
  image: mapImages['the future'],
  newUser: null,
};

test('shows navigation button', async () => {
  const user = userEvent.setup();

  render(
    <ImageFrame
      map={props.map}
      image={props.image}
      findables={props.findables}
    />
  );

  const btn = await screen.getByRole('button', {
    name: 'Show navigation menu',
  });

  expect(btn).toBeInTheDocument();
  await user.click(btn);

  // ASSERT
  // expect(screen.getByRole('heading')).toHaveTextContent('hello there');
  // expect(screen.getByRole('button')).toBeDisabled();
});
