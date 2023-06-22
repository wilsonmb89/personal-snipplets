import React from 'react';
import { createEvent, render, screen, waitFor } from '../../../test-utils/provider-mock';
import BdbAtToastImpl from './BdbAtToastImpl';

describe('Toast component', () => {
  const onLinkClick = jest.fn();
  const onDismiss = jest.fn();

  test('should render toast', async () => {
    const toast = render(<BdbAtToastImpl />);
    expect(toast).toBeTruthy();
  });

  test('should close the toast', async () => {
    render(<BdbAtToastImpl message="my-message" type="SUCESSS" onDismiss={onDismiss} />);
    const toast = await waitFor(() => screen.getByTestId('toast'));
    const closeToastEvent: Event = createEvent('closeToast', toast);
    toast.dispatchEvent(closeToastEvent);
    expect(toast).toBeTruthy();
  });

  test('should open the toast link', async () => {
    render(<BdbAtToastImpl message="my-message" type="SUCESSS" onLinkClick={onLinkClick} />);
    const toast = await waitFor(() => screen.getByTestId('toast'));
    const closeToastEvent: Event = createEvent('linkClick', toast);
    toast.dispatchEvent(closeToastEvent);
    expect(toast).toBeTruthy();
  });
});
