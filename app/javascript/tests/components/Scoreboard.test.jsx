import React from 'react';
import userEvent from '@testing-library/user-event';
import styles from '@stylesheets/Scoreboard.module.css';
import Scoreboard from '@javascript/components/Scoreboard/Scoreboard';
import { act, render, screen } from '@testing-library/react';
import { afterAll, afterEach, expect, test, vi } from 'vitest';

vi.mock('@javascript/mapImages', () => ({ mapImages: {} }));

const originalFetch = window.fetch;
const map = { id: 2, name: 'The Gold Rush' };
const scores = [
  {
    pos: 1,
    value: 900.71,
    created: '05 January 2026 10:32:02',
    map: {
      id: 2,
      name: 'The Gold Rush',
    },
    user: {
      id: 1,
      name: 'john',
    },
  },
  {
    pos: 2,
    value: 892.24,
    created: '02 January 2026 06:42:45',
    map: {
      id: 2,
      name: 'The Gold Rush',
    },
    user: {
      id: 2,
      name: 'jane',
    },
  },
];

window.fetch = vi.fn().mockResolvedValue({ json: vi.fn(() => scores) });

afterEach(() => vi.clearAllMocks());
afterAll(() => (window.fetch = originalFetch));

test('fetches map scores', async () => {
  await act(() => render(<Scoreboard map={map} initialPage={3} />));

  expect(window.fetch).toHaveBeenCalledTimes(1);
  expect(window.fetch).toHaveBeenCalledWith(`/scores?map_id=${map.id}&page=3`);
});

test('renders personal best', async () => {
  const user = { user_id: scores[1].user.id, value: scores[1].value };

  await act(() =>
    render(<Scoreboard map={map} personalBest={user} initialPage={1} />)
  );

  expect(
    screen.getByRole('heading', {
      name: /your personal best: 892\.24/i,
    })
  ).toBeInTheDocument();
});

test('renders map scores', async () => {
  expect.assertions(8);

  await act(() => render(<Scoreboard map={map} initialPage={1} />));

  scores.forEach((score) => {
    const pos = screen.getByRole('cell', { name: score.pos });
    const date = screen.getByRole('cell', { name: score.created });
    const user = screen.getByRole('cell', { name: score.user.name });
    const value = screen.getByRole('cell', { name: score.value });

    [pos, date, user, value].forEach((el) => expect(el).toBeInTheDocument());
  });
});

test('highlights current user score', async () => {
  const user = { user_id: scores[1].user.id, value: scores[1].value };

  await act(() =>
    render(<Scoreboard map={map} personalBest={user} initialPage={1} />)
  );

  const userCell = screen.getByRole('cell', { name: scores[1].user.name });

  expect(userCell).toHaveClass(styles.userScore);
});

describe('when map has more than 25 saved scores', () => {
  const scoresCollection = [];
  for (let i = 0; i < 40; i++) {
    scoresCollection.push({ ...scores[0], pos: i + 1, value: 200 - i });
  }

  test('renders score pagination', async () => {
    window.fetch.mockResolvedValueOnce({ json: vi.fn(() => scoresCollection) });

    await act(() => render(<Scoreboard map={map} initialPage={1} />));

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    expect(
      screen.getByText(/showing 1 to 25 \| score 200 \- 176/i)
    ).toBeInTheDocument();
  });

  test('renders accurate number of scores per page', async () => {
    const user = userEvent.setup();
    window.fetch.mockResolvedValueOnce({ json: vi.fn(() => scoresCollection) });

    await act(() => render(<Scoreboard map={map} initialPage={1} />));

    const pageInput = screen.getByRole('spinbutton');
    const tableBody = screen.getByTestId('table-body');

    expect(
      screen.getByText(/showing 1 to 25 \| score 200 \- 176/i)
    ).toBeInTheDocument();
    expect(tableBody.children).toHaveLength(25);

    await user.clear(pageInput);
    await user.type(pageInput, '2');

    expect(
      screen.getByText(/showing 26 to 40 \| score 175 \- 161/i)
    ).toBeInTheDocument();
    expect(tableBody.children).toHaveLength(15);
  });
});
