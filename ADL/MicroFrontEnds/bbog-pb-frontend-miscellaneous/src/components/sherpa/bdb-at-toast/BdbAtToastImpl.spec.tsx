import React from 'react';
import '@testing-library/jest-dom';

import { act, render, waitFor, screen, createEvent } from '@test-utils/provider-mock';
import BdbAtToastImpl from './BdbAtToastImpl';

describe('BdbToastImpl component unit tests', () => {
  const doSomenthing = jest.fn();

  test('should load component successfully', async () => {
    act(() => {
      render(
        <BdbAtToastImpl type="ERROR" messsage="TOAST TEST" onDismiss={doSomenthing} titleToast="TOAST TEST TITLE" />
      );
    });
    const element = await waitFor(() => screen.getByTestId('bdb-at-toast'));
    expect(element).toBeInTheDocument();
  });

  test('should load component with default values', async () => {
    act(() => {
      render(<BdbAtToastImpl messsage="TOAST TEST" onDismiss={doSomenthing} />);
    });
    const element = await waitFor(() => screen.getByTestId('bdb-at-toast'));
    expect(element).toBeInTheDocument();
  });

  test('should load dismiss toast successfully', async () => {
    act(() => {
      render(
        <BdbAtToastImpl type="ERROR" messsage="TOAST TEST" onDismiss={doSomenthing} titleToast="TOAST TEST TITLE" />
      );
    });
    const element = await waitFor(() => screen.getByTestId('bdb-at-toast'));
    expect(element).toBeInTheDocument();
    const event: Event & { detail?: unknown } = createEvent('closeToast', element);
    element.dispatchEvent(event);
    expect(doSomenthing).toBeCalled();
  });
});
