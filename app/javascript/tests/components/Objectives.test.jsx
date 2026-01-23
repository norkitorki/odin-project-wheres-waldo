import React from 'react';
import userEvent from '@testing-library/user-event';
import styles from '@stylesheets/Objectives.module.css';
import Objectives from '@javascript/components/Objectives/Objectives';
import { render, screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

vi.mock('@javascript/components/Icons/Icons', () => ({
  SuccessIcon: () => <svg data-testid="success-icon" />,
}));

const findables = [
  { name: 'Waldo', type_of: 'character', image: <img alt="Waldo image" /> },
  { name: 'Wenda', type_of: 'character', image: <img alt="Wenda image" /> },
  { name: 'Bone', type_of: 'item', image: <img alt="Bone image" /> },
  { name: 'Key', type_of: 'item', image: <img alt="Key image" /> },
];

const discoveries = { count: 1, toArray: [true, null, null, null] };

const props = {
  findables: [
    { name: 'Waldo', type_of: 'character', image: <img alt="Waldo image" /> },
    { name: 'Wenda', type_of: 'character', image: <img alt="Wenda image" /> },
    { name: 'Bone', type_of: 'item', image: <img alt="Bone image" /> },
    { name: 'Key', type_of: 'item', image: <img alt="Key image" /> },
  ],
  discoveries: { count: 1, toArray: [true, null, null, null] },
};

test('renders toggle buttons', () => {
  render(<Objectives {...props} />);

  screen.getByRole('button', { name: /show characters/i });
  screen.getByRole('button', { name: /show items/i });
});

test('renders characters and items', () => {
  expect.assertions(8);

  render(<Objectives {...props} />);

  const images = screen.getAllByRole('img');
  findables.forEach((findable, index) => {
    const listItem = screen.getByRole('listitem', {
      name: new RegExp(findable.name, 'i'),
    });
    expect(listItem).toBeInTheDocument();
    expect(images[index].parentElement).toBe(listItem);
  });
});

test('renders success icon on uncovered findables', () => {
  render(<Objectives {...props} />);

  const waldo = screen.getByRole('listitem', { name: /waldo/i });
  const wenda = screen.getByRole('listitem', { name: /wenda/i });

  const waldoIcon = within(waldo).getByTestId('success-icon');
  const wendaIcon = within(wenda).queryByTestId('success-icon');

  expect(waldoIcon).toBeInTheDocument();
  expect(wendaIcon).not.toBeInTheDocument();
});

test('toggles objectives on button click', async () => {
  const user = userEvent.setup();

  render(<Objectives {...props} />);

  const charactersBtn = screen.getByRole('button', {
    name: /show characters/i,
  });
  const itemsBtn = screen.getByRole('button', { name: /show items/i });

  await user.click(charactersBtn);
  await user.click(itemsBtn);

  expect(charactersBtn).toHaveClass(styles.active);
  expect(charactersBtn.textContent).toBe('Hide Characters');
  expect(itemsBtn).toHaveClass(styles.active);
  expect(itemsBtn.textContent).toBe('Hide Items');
});
