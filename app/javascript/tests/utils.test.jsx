import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from '@testing-library/react';
import { _fetch } from '@javascript/utils.js';

const fetchSpy = vi.spyOn(window, 'fetch').mockReturnValue('[]');

const metaElement = <meta name="csrf-token" content="wkf23fhwewfewmc" />;
const url = 'http://127.0.0.1/users';

afterEach(() => vi.clearAllMocks());

test('should fetch to url', async () => {
  render(metaElement);

  const response = await _fetch(url, 'GET');

  expect(fetchSpy).toHaveBeenCalledTimes(1);
  expect(fetchSpy).toHaveBeenCalledWith(url, {
    method: 'GET',
    headers: { 'X-CSRF-Token': 'wkf23fhwewfewmc', accept: 'application/json' },
  });
  expect(response).toBe('[]');
});

describe('when fetch response does not respond with status 200', () => {
  test('returns response', async () => {
    render(metaElement);

    const responseObject = { status: 404 };
    fetchSpy.mockResolvedValueOnce(responseObject);

    const response = await _fetch(url, 'GET');

    expect(response).toBe(responseObject);
  });
});

describe('when callback is defined', () => {
  test('calls callback with json response', async () => {
    render(metaElement);

    const responseObject = {
      status: 200,
      json: vi.fn(() => [{ id: 1, name: 'testUser' }]),
    };
    fetchSpy.mockResolvedValueOnce(responseObject);

    const callback = vi.fn();
    await _fetch(url, 'GET', callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([{ id: 1, name: 'testUser' }]);
  });
});
