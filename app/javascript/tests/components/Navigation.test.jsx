import React from 'react';
import userEvent from '@testing-library/user-event';
import styles from '@stylesheets/Navigation.module.css';
import Navigation from '@javascript/components/Navigation/Navigation';
import * as superglue from '@thoughtbot/superglue';
import { render, screen, within } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

vi.mock('@thoughtbot/superglue', { spy: true });
const useContent = vi.mocked(superglue.useContent).mockReturnValue({});

const originalQuerySelector = window.document.querySelector;
vi.spyOn(document, 'querySelector').mockReturnValue({ content: '' });

afterEach(() => vi.clearAllMocks());
afterAll(() => (window.document.querySelector = originalQuerySelector));

test('renders navigation button', () => {
  render(<Navigation />);

  const button = screen.getByRole('button', { name: /open navigation menu/i });

  expect(button).toBeInTheDocument();
});

test('opens and closes menu when navigation button is clicked', async () => {
  const user = userEvent.setup();

  render(<Navigation />);

  const navigation = screen.getByRole('navigation');
  const button = screen.getByRole('button', {
    name: /open navigation menu/i,
  });

  expect(navigation).not.toHaveClass(styles.extended);
  expect(button).toHaveAttribute('aria-label', 'Open navigation menu');

  await user.click(button);

  expect(button).toHaveAttribute('aria-label', 'Close navigation menu');
  expect(navigation).toHaveClass(styles.extended);

  await user.click(button);

  expect(navigation).not.toHaveClass(styles.extended);
});

test('renders links', () => {
  const links = [
    { url: '/', content: 'Home' },
    { url: '/user', content: <p>Hello User</p> },
  ];

  render(<Navigation links={links} />);

  const navigation = screen.getByRole('navigation');
  const homeLink = within(navigation).getByRole('link', { name: /home/i });
  const paraLink = within(navigation).getByRole('link', {
    name: /hello user/i,
  });

  expect(homeLink).toBeInTheDocument();
  expect(homeLink).toHaveAttribute('href', '/');
  expect(paraLink).toBeInTheDocument();
  expect(paraLink).toHaveAttribute('href', '/user');
  expect(paraLink.children[0].nodeName).toBe('P');
});

describe('when links have no url property', () => {
  test('renders elements', () => {
    const MyButton = ({ text }) => <button>{text}</button>;

    render(<Navigation links={[{ content: <MyButton text="Click Me" /> }]} />);

    const navigation = screen.getByRole('navigation');
    const button = within(navigation).getByRole('button', {
      name: /click me/i,
    });

    expect(button.parentElement.nodeName).not.toBe('A');
  });
});

describe('when user is signed out', () => {
  beforeAll(() => useContent.mockReturnValue({ currentUser: null }));

  test('renders sign in form', () => {
    render(<Navigation />);

    const navigation = screen.getByRole('navigation');
    const message = within(navigation).getByText(/not signed in/i);
    const input = within(navigation).getByRole('textbox');
    const button = within(navigation).getByRole('button', { name: /sign in/i });
    const form = button.form;

    expect(message).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input.name).toBe('user_token');
    expect(button).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(form.action).toMatch(/\/authentications$/i);
    expect(form.method).toBe('post');
  });
});

describe('when user is signed in', () => {
  beforeAll(() =>
    useContent.mockReturnValue({ currentUser: { name: 'testUser', id: 1 } })
  );

  test('renders sign out form', () => {
    render(<Navigation />);

    const navigation = screen.getByRole('navigation');
    const message = within(navigation).getByText(/signed in as/i);
    const link = within(navigation).getByRole('link', { name: /testuser/i });
    const button = within(navigation).getByRole('button', {
      name: /sign out/i,
    });
    const form = button.form;
    const hiddenInput = originalQuerySelector.call(document, [
      'input[type="hidden"]',
    ]);

    expect(message).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link.href).toMatch(/\/user$/i);
    expect(button).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(form.action).toMatch(/\/authentications$/i);
    expect(hiddenInput.name).toBe('_method');
    expect(hiddenInput.value).toBe('delete');
  });
});
