import React from 'react';
import Home from '@javascript/components/Home/Home';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { mapPreviews } from '@javascript/mapImages';

vi.mock('@images/waldo.png', () => ({
  default: '/images/waldo.png',
}));

vi.mock('@javascript/mapImages', () => ({
  mapPreviews: {
    'on the beach': '/images/on_the_beach.png',
    'horseplay in troy': '/images/horseplay_in_troy.png',
    'the great escape': '/images/the_great_escape.png',
  },
}));

vi.mock('@javascript/components/Icons/Icons', () => ({
  ScoresIcon: vi.fn(() => (
    <svg>
      <title>Scores icon</title>
    </svg>
  )),
  PlayIcon: vi.fn(() => (
    <svg>
      <title>Play Icon</title>
    </svg>
  )),
}));

const maps = [
  { id: 1, name: 'On the Beach' },
  { id: 2, name: 'Horseplay in Troy' },
  { id: 3, name: 'The Great Escape' },
];

test('renders header', () => {
  render(<Home maps={maps} />);

  const header = screen.getByRole('heading', { name: /where's waldo\?/i });
  expect(header).toBeInTheDocument();
});

test('renders maps', () => {
  expect.assertions(12);

  render(<Home maps={maps} />);

  maps.forEach((map) => {
    const heading = screen.getByRole('heading', { name: map.name });
    expect(heading).toBeInTheDocument();

    const image = screen.getByRole('img', {
      name: new RegExp(map.name, 'i'),
    });
    expect(image).toHaveAttribute('src', mapPreviews[map.name.toLowerCase()]);

    const playLink = screen.getByTitle(`Play ${map.name}`);
    expect(playLink).toBeInTheDocument();

    const scoresLink = screen.getByTitle(`Show ${map.name} scores`);
    expect(scoresLink).toBeInTheDocument();
  });
});
