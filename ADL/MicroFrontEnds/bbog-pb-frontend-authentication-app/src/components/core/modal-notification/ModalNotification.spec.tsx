import React from 'react';
import { createEvent, render, screen, waitFor } from '../../../test-utils/provider-mock';

import ModalNotification, { NotificationControl, NotificationData } from './ModalNotification';
import showNotificationModal from '.';
import store from '../../../store';

describe('Notification unit tests', () => {
  const action = () => jest.fn();
  const onSuccess = jest.fn();
  const onError = jest.fn();

  const data: NotificationData = {
    type: 'success',
    name: 'Test Title',
    message: 'This is a test modal.'
  };

  afterEach(() => {
    jest.clearAllMocks();
    store.dispatch({ type: 'UNMOUNT' });
  });

  test('should load the modal from a function', async () => {
    const actions: NotificationControl[] = [
      {
        text: 'Action #1',
        action: action
      }
    ];
    showNotificationModal(data, actions);
    const modal = await waitFor(() => screen.getByTestId('notification-modal'));
    expect(modal).toBeTruthy();
    const closeModalEvent: Event & { detail?: unknown } = createEvent('closeAlert', modal);
    modal.dispatchEvent(closeModalEvent);
  });

  test('should load the modal from a render', async () => {
    const actions: NotificationControl[] = [
      {
        text: 'Action #1',
        action: action
      },
      {
        text: 'Action #2',
        action: action
      }
    ];
    render(<ModalNotification data={data} actions={actions} onSuccess={onSuccess} onError={onError} />);
    const modal = await waitFor(() => screen.getByTestId('notification-modal'));
    expect(modal).toBeTruthy();
    const clickOptionEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modal);
    clickOptionEvent.detail = {
      value: 'Action #1'
    };
    modal.dispatchEvent(clickOptionEvent);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  test('should load the modal from a render without buttons', async () => {
    render(<ModalNotification data={data} actions={[]} onSuccess={onSuccess} onError={onError} />);
    const modal = await waitFor(() => screen.getByTestId('notification-modal'));
    expect(modal).toBeTruthy();
  });
});
