import React from 'react';
import userEvent from '@testing-library/user-event';
import WinningScreen from '@javascript/components/WinningScreen/WinningScreen';
import { act, render, screen } from '@testing-library/react';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

vi.mock('@javascript/utils.js', () => ({ _fetch: fetchMock }));

let responseObject;
const fetchMock = vi.hoisted(() => vi.fn(() => responseObject));
const props = {
  map: { id: 1, name: 'Waldo Dreamland' },
  discoveries: { reset: vi.fn() },
  newUser: {
    form: {
      inputs: {
        name: {
          type: 'text',
          name: 'user[name]',
          id: 'user_name',
        },
        submit: {
          name: 'commit',
          text: 'Create User',
          type: 'submit',
        },
      },
      extras: {
        csrf: {
          name: 'authenticity_token',
          type: 'hidden',
          defaultValue:
            'ewfeflwefJTF8758weqfujqwdf7817364jkHIGDHJIQPQWDQWDGBQGWDW',
          autoComplete: 'off',
        },
      },
      form: {
        action: '/users',
        acceptCharset: 'UTF-8',
        method: 'post',
      },
    },
    formErrors: null,
  },
};

afterEach(() => vi.clearAllMocks());
beforeEach(() => {
  responseObject = {
    status: 200,
    json: vi.fn(() => ({ value: 900.24 })),
  };
});

test('fetches current and the best ten scores', async () => {
  await act(() => render(<WinningScreen {...props} />));

  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('/score', 'GET');
  expect(fetchMock).toHaveBeenLastCalledWith(
    `/scores?map_id=${props.map.id}&page=1&per_page=10`,
    'GET',
    expect.any(Function),
  );
});

test('renders final score', async () => {
  await act(() => render(<WinningScreen {...props} />));

  expect(
    screen.getByText(/you've cleared the map with a score of/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/900\.24/i)).toBeInTheDocument();
});

test('renders navigation buttons', async () => {
  await act(() => render(<WinningScreen {...props} />));

  expect(
    await screen.findByRole('button', { name: /replay/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /map scores/i })).toBeInTheDocument();
});

describe('when clicking replay button', () => {
  test('sends calls to reset score/discoveries', async () => {
    const user = userEvent.setup();

    await act(() => render(<WinningScreen {...props} />));

    const replayButton = screen.getByRole('button', { name: /replay/i });
    await user.click(replayButton);

    expect(fetchMock).toHaveBeenLastCalledWith('/score', 'DELETE');
    expect(props.discoveries.reset).toHaveBeenCalledTimes(1);
  });
});

describe('when user is signed out', () => {
  test('renders user form', async () => {
    await act(() => render(<WinningScreen {...props} />));

    const input = screen.getByRole('textbox', {
      name: /enter your name to save your result/i,
    });
    const submitButton = screen.getByRole('button', { name: /create user/i });
    const form = submitButton.form;

    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(form.action).toMatch(/\users$/i);
    expect(form.method).toBe('post');
  });
});

describe('when user is signed in', () => {
  let newUser;

  beforeAll(() => {
    newUser = props.newUser;
    props.newUser = null;
  });

  afterAll(() => (props.newUser = newUser));

  describe('when no previous score has been saved', () => {
    test('posts score', async () => {
      await act(() => render(<WinningScreen {...props} />));

      expect(fetchMock).toHaveBeenCalledWith('/scores', 'POST');
    });
  });

  describe('when previous score exists', () => {
    test('posts new score when previous score is smaller', async () => {
      responseObject = {
        status: 200,
        json: vi.fn(() => ({ value: 978, best: 805 })),
      };
      fetchMock.mockResolvedValueOnce(responseObject);

      await act(() => render(<WinningScreen {...props} />));

      expect(fetchMock).toHaveBeenCalledWith('/scores', 'POST');
    });

    test('does not post score when previous score is bigger', async () => {
      responseObject = {
        status: 200,
        json: vi.fn(() => ({ value: 901, best: 920 })),
      };
      fetchMock.mockResolvedValueOnce(responseObject);

      await act(() => render(<WinningScreen {...props} />));

      expect(fetchMock).not.toHaveBeenCalledWith('/scores', 'POST');
    });
  });
});
