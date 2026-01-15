import React from 'react';
import userEvent from '@testing-library/user-event';
import styles from '@stylesheets/ItemSelector.module.css';
import ItemSelector from '@javascript/components/ItemSelector/ItemSelector';
import { render, screen, within } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

const onClickMock = vi.fn();
const refMock = { current: null };
const findables = [
  { name: 'Waldo', type_of: 'character', image: <img alt="Waldo image" /> },
  { name: 'Wenda', type_of: 'character', image: <img alt="Wenda image" /> },
  { name: 'Bone', type_of: 'item', image: <img alt="Bone image" /> },
  { name: 'Key', type_of: 'item', image: <img alt="Key image" /> },
];
const discoveries = { count: 0, toArray: [null, null, null, null] };

afterEach(() => {
  vi.clearAllMocks();
  refMock.current = null;
});

test('renders all findables', () => {
  expect.assertions(8);

  render(
    <ItemSelector
      findables={findables}
      discoveries={discoveries}
      onClick={onClickMock}
      ref={refMock}
    />
  );

  findables.forEach((findable) => {
    const button = screen.getByRole('button', {
      name: new RegExp(findable.name, 'i'),
    });
    expect(button).toBeInTheDocument();

    const image = within(button).getByRole('img', {
      name: new RegExp(`${findable.name} portrait`, 'i'),
    });
    expect(image).toBeInTheDocument();
  });
});

test('excludes uncovered findables from list', () => {
  expect.assertions(2);

  render(
    <ItemSelector
      findables={findables}
      discoveries={{ count: 2, toArray: [null, true, true, null] }}
      onClick={onClickMock}
      ref={refMock}
    />
  );

  findables.slice(1, 3).forEach((findable) => {
    expect(
      screen.queryByRole('button', { name: new RegExp(findable.name, 'i') })
    ).not.toBeInTheDocument();
  });
});

test('calls onClick callback when findable is clicked', async () => {
  const user = userEvent.setup();

  render(
    <ItemSelector
      findables={findables}
      discoveries={discoveries}
      onClick={onClickMock}
      ref={refMock}
    />
  );

  const button = screen.getByRole('button', { name: /key/i });
  await user.click(button);

  expect(onClickMock).toHaveBeenCalledTimes(1);
  expect(onClickMock).toHaveBeenCalledWith(expect.any(Object), '3');
});

test('stores rendered element in a ref', () => {
  render(
    <ItemSelector
      findables={findables}
      discoveries={discoveries}
      onClick={onClickMock}
      ref={refMock}
    />
  );

  expect(refMock.current).not.toBeNull();
  expect(refMock.current.nodeName).toBe('DIV');
  expect(refMock.current).toHaveClass(styles.container);
  expect(refMock.current.firstElementChild).toHaveClass(styles.characters);
  expect(refMock.current.lastElementChild).toHaveClass(styles.items);
});
