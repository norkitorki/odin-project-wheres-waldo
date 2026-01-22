import React from 'react';
import UserHome from '@javascript/components/UserHome/UserHome';
import { afterAll, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock(import('@javascript/components/Navigation/Navigation'), () => ({
  default: NavigationMock,
}));

const NavigationMock = vi.hoisted(() => vi.fn());
const alertSpy = vi.spyOn(window, 'alert').mockReturnValue(null);

afterAll(() => vi.restoreAllMocks());

const props = {
  user: { name: 'testUser', token: '23fjk238767bewfew' },
  scores: [
    {
      creationDate: '12 January 10:42:45',
      map: {
        id: 1,
        name: 'The Future',
      },
      value: 924.25,
    },
    {
      creationDate: '20 January 07:04:56',
      map: {
        id: 2,
        name: 'Horseplay In Troy',
      },
      value: 843.54,
    },
  ],
  deleteForm: {
    inputs: {
      submit: {
        name: 'commit',
        text: 'Delete User',
        type: 'submit',
      },
    },
    extras: {
      method: {
        name: '_method',
        type: 'hidden',
        defaultValue: 'delete',
        autoComplete: 'off',
      },
      csrf: {
        name: 'authenticity_token',
        type: 'hidden',
        defaultValue:
          'ewoiwoejfweew48234jk2nfjkl2ewf24923423hfwjsdfjkwdkf3oi2fjk',
        autoComplete: 'off',
      },
    },
    form: {
      action: '/user',
      acceptCharset: 'UTF-8',
      method: 'post',
    },
  },
};

test('renders navigation', () => {
  render(<UserHome {...props} />);

  expect(NavigationMock).toHaveBeenCalledTimes(1);
});

test('renders heading', () => {
  render(<UserHome {...props} />);

  const heading = screen.getByRole('heading', {
    name: /welcome back testUser!/i,
  });

  expect(heading).toBeInTheDocument();
});

test('renders user token', () => {
  render(<UserHome {...props} />);

  const tokenInput = screen.getByRole('textbox', { name: /token copy/i });

  expect(tokenInput).toBeInTheDocument();
  expect(tokenInput).toHaveValue(props.user.token);
  expect(tokenInput).toBeDisabled();
});

test('renders user delete form', () => {
  render(<UserHome {...props} />);

  const deleteButton = screen.getByRole('button', {
    name: /delete user/i,
  });
  const form = deleteButton.form;
  const hiddenInput = form.querySelector('[name="_method"]');

  expect(form.action).toMatch(/\/user$/i);
  expect(form.method).toBe('post');
  expect(hiddenInput).toBeInTheDocument();
  expect(hiddenInput.type).toBe('hidden');
  expect(hiddenInput).toHaveValue('delete');
  expect(deleteButton).toBeInTheDocument();
});

test('renders user scores', () => {
  expect.assertions(8);

  render(<UserHome {...props} />);

  const mapLinks = screen.getAllByRole('link', { name: /play/i });
  const scoresLinks = screen.getAllByRole('link', { name: /scores/i });

  props.scores.forEach((score, index) => {
    const { id: mapId, name: mapName } = score.map;
    const nameRegex = new RegExp(mapName, 'i');
    const scoreRegex = new RegExp(`best score: ${score.value}`, 'i');

    expect(mapLinks[index].href).toMatch(new RegExp(`maps/${mapId}$`));
    expect(scoresLinks[index].href).toMatch(new RegExp(`scoreboard/${mapId}$`));
    expect(screen.getByText(nameRegex)).toBeInTheDocument();
    expect(screen.getByText(scoreRegex)).toBeInTheDocument();
  });
});

test('copies user token to clipboard', async () => {
  const user = userEvent.setup();

  render(<UserHome {...props} />);

  const button = screen.getByRole('button', { name: /copy/i });
  await user.click(button);
  const clipboardContent = await navigator.clipboard.readText();

  expect(clipboardContent).toBe(props.user.token);
  expect(alertSpy).toHaveBeenCalledWith(
    'User token has been copied to your clipboard',
  );
});
