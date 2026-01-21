import React from 'react';
import MessageBoard from '@javascript/components/MessageBoard/MessageBoard';
import styles from '@stylesheets/MessageBoard.module.css';
import { sendMessage } from '@javascript/components/MessageBoard/MessageBoardHelper';
import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

test('renders message passed as prop', () => {
  const message = 'Some message passed as a prop';

  render(<MessageBoard message={message} />);

  expect(
    within(screen.getByTestId('message-board')).getByText(message),
  ).toBeInTheDocument();
});

describe('#sendMessage', () => {
  test('renders message', () => {
    render(<MessageBoard />);

    const messageBoard = screen.getByTestId('message-board');
    const message = 'My test message.';
    expect(messageBoard).not.toHaveClass(styles.visible);
    sendMessage(message);

    expect(messageBoard).toHaveClass(styles.visible);
    expect(within(messageBoard).getByText(message)).toBeInTheDocument();
  });

  test('hides message after specified seconds', async () => {
    render(<MessageBoard />);

    const messageBoard = screen.getByTestId('message-board');
    sendMessage('Test Message', 1);

    expect(messageBoard).toHaveClass(styles.visible);
    await waitFor(() => expect(messageBoard).not.toHaveClass(styles.visible), {
      timeout: 1500,
    });
  });
});
