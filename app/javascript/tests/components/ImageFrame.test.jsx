import React from 'react';
import userEvent from '@testing-library/user-event';
import ImageFrame from '@javascript/components/ImageFrame/ImageFrame';
import { act, render, screen, waitFor } from '@testing-library/react';
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { mapImages } from '@javascript/mapImages';

vi.mock(import('@thoughtbot/superglue'), () => ({
  useContent: () => ({ currentUser: { name: 'test' } }),
}));

vi.mock(import('@javascript/components/WinningScreen/WinningScreen'), () => ({
  default: WinningScreenMock,
}));

vi.mock(import('@javascript/components/Navigation/Navigation'), () => ({
  default: NavigationMock,
}));

vi.mock(import('@javascript/utils'), () => ({ _fetch: _fetchMock }));

vi.mock(
  '@javascript/components/ImageFrame/ImageFrameHelper',
  async (original) => {
    const actual = await original();
    return {
      ...actual,
      findCoordinates: findCoordinatesMock,
    };
  },
);

const originalFetch = window.fetch;
const fetchMock = vi
  .fn()
  .mockResolvedValue({ json: vi.fn().mockResolvedValue(null) });
const WinningScreenMock = vi.hoisted(() => vi.fn());
const NavigationMock = vi.hoisted(() => vi.fn(() => <a href="/">Home</a>));
const _fetchMock = vi.hoisted(() =>
  vi.fn(() => Promise.resolve({ json: vi.fn() })),
);
const findCoordinatesMock = vi.hoisted(() =>
  vi.fn().mockReturnValue({ x: 20.4, y: 36.1 }),
);
const props = {
  map: { id: 1, name: 'The Future' },
  findables: [
    { name: 'Waldo', type_of: 'character' },
    { name: 'Key', type_of: 'item' },
  ],
  image: mapImages['the future'],
  newUser: null,
};

window.fetch = fetchMock;

afterEach(() => vi.clearAllMocks());
afterAll(() => (window.fetch = originalFetch));

test('shows navigation', async () => {
  await act(() => render(<ImageFrame {...props} />));

  expect(NavigationMock).toHaveBeenCalledTimes(1);
});

test('renders findable item selector', async () => {
  const user = userEvent.setup();
  expect.assertions(2);

  await act(() => render(<ImageFrame {...props} />));

  const img = screen.getByTestId('main-image');

  await user.click(img);

  props.findables.forEach((findable) =>
    expect(
      screen.getByRole('button', { name: new RegExp(`${findable.name}`, 'i') }),
    ).toBeInTheDocument(),
  );
});

test('deletes game session state after unmount', async () => {
  const user = userEvent.setup();

  await act(() => render(<ImageFrame {...props} />));

  await user.click(screen.getByRole('link', { name: /home/i }));

  expect(_fetchMock).toHaveBeenCalledTimes(1);
  expect(_fetchMock).toHaveBeenCalledWith('/game_sessions', 'DELETE');
});

test('calls fetch api with correct arguments after click', async () => {
  const user = userEvent.setup();

  await act(() => render(<ImageFrame {...props} />));

  const img = screen.getByTestId('main-image');

  await user.click(img);
  await user.click(screen.getByRole('button', { name: /waldo/i }));

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenLastCalledWith(
    `/findable?map_id=${props.map.id}&name=Waldo&x=20.4&y=36.1`,
    {
      method: 'GET',
      headers: { Accept: 'application/json' },
    },
  );
});

describe('when matching a findable', () => {
  beforeEach(() =>
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({
        name: 'Waldo',
        type_of: 'character',
      }),
    }),
  );

  test('places target marker', async () => {
    const user = userEvent.setup();

    await act(() => render(<ImageFrame {...props} />));

    expect(screen.getAllByTestId('target-circle')).toHaveLength(1);
    const img = screen.getByTestId('main-image');

    await user.click(img);
    await user.click(screen.getByRole('button', { name: /waldo/i }));

    expect(screen.getAllByTestId('target-circle')).toHaveLength(2);
  });

  test('displays message', async () => {
    const user = userEvent.setup();

    await act(() => render(<ImageFrame {...props} />));

    const img = screen.getByTestId('main-image');

    await user.click(img);
    await user.click(screen.getByRole('button', { name: /waldo/i }));

    expect(screen.getByText(/waldo found!/i)).toBeInTheDocument();
  });
});

describe('when not matching a findable', () => {
  test('displays message', async () => {
    const user = userEvent.setup();

    await act(() => render(<ImageFrame {...props} />));

    const img = screen.getByTestId('main-image');

    await user.click(img);
    await user.click(screen.getByRole('button', { name: /waldo/i }));

    expect(screen.getByText(/waldo not found!/i)).toBeInTheDocument();
  });
});

describe('when map is cleared', () => {
  beforeEach(() => {
    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          name: 'Waldo',
          type_of: 'character',
        }),
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          name: 'Key',
          type_of: 'item',
        }),
      });
  });

  test('renders winning screen', async () => {
    const user = userEvent.setup();

    await act(() => render(<ImageFrame {...props} />));

    const img = screen.getByTestId('main-image');
    expect(WinningScreenMock).toHaveBeenCalledTimes(0);

    await user.click(img);
    await user.click(screen.getByRole('button', { name: /waldo/i }));
    await user.click(img);
    await user.click(screen.getByRole('button', { name: /key/i }));

    expect(WinningScreenMock).toHaveBeenCalledTimes(1);
  });
});
