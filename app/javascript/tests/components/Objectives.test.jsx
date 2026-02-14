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

  screen.getByRole('button', { name: /toggle characters/i });
  screen.getByRole('button', { name: /toggle items/i });
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

test('toggles characters on button click', async () => {
  const user = userEvent.setup();

  render(<Objectives {...props} />);

  const charactersBtn = screen.getByRole('button', {
    name: /toggle characters/i,
  });
  const objectives = screen.getByTestId('character-objectives');

  await user.click(charactersBtn);

  expect(objectives).toHaveClass(styles.objectivesShown);

  await user.click(charactersBtn);

  expect(objectives).not.toHaveClass(styles.objectivesShown);
});

test('toggles items on button click', async () => {
  const user = userEvent.setup();

  render(<Objectives {...props} />);

  const itemsBtn = screen.getByRole('button', {
    name: /toggle items/i,
  });
  const objectives = screen.getByTestId('item-objectives');

  await user.click(itemsBtn);

  expect(objectives).toHaveClass(styles.objectivesShown);

  await user.click(itemsBtn);

  expect(objectives).not.toHaveClass(styles.objectivesShown);
});

test('toggling one type of objectives untoggles other type', async () => {
  const user = userEvent.setup();

  render(<Objectives {...props} />);

  const charactersBtn = screen.getByRole('button', {
    name: /toggle characters/i,
  });
  const itemsBtn = screen.getByRole('button', {
    name: /toggle items/i,
  });
  const characterObjectives = screen.getByTestId('character-objectives');
  const itemObjectives = screen.getByTestId('item-objectives');

  await user.click(charactersBtn);

  expect(characterObjectives).toHaveClass(styles.objectivesShown);

  await user.click(itemsBtn);

  expect(characterObjectives).not.toHaveClass(styles.objectivesShown);
  expect(itemObjectives).toHaveClass(styles.objectivesShown);
});
