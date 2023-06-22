import React from 'react';
import { NotificationData } from '../../../notification/Notification';
import { createEvent, fireEvent, render, screen, waitFor } from '../../../test-utils/provider-mock';
import LayoutHeader from './LayoutHeader';

describe('Layout header component', () => {
  const goBack = jest.fn();
  const goForward = jest.fn();
  const children = <div>Content</div>;
  const titleLabel = 'Title Header';
  const modalProps: NotificationData = {
    type: 'warning',
    name: 'Modal title',
    message: 'Modal message'
  };

  test('should load a layout header', async () => {
    const layoutHeader = render(<LayoutHeader {...{ goBack, goForward, titleLabel }}>{children}</LayoutHeader>);
    expect(layoutHeader).toBeTruthy();
  });

  test('should load a header with confirmation modal', async () => {
    const layoutHeader = render(
      <LayoutHeader {...{ goBack, goForward, titleLabel, modalProps }} confirmModal>
        {children}
      </LayoutHeader>
    );
    expect(layoutHeader).toBeTruthy();
  });

  test('should go back page', async () => {
    const layoutHeader = render(<LayoutHeader {...{ goBack, goForward, titleLabel }}>{children}</LayoutHeader>);

    const header: HTMLElement = await waitFor(() => screen.getByTestId('header'));
    const clickBackEvent: Event & { detail?: unknown } = createEvent('backBtnClicked', header);
    fireEvent(header, clickBackEvent);

    expect(layoutHeader).toBeTruthy();
    expect(header).toBeTruthy();
  });

  test('should show modal to go back page', async () => {
    const layoutHeader = render(
      <LayoutHeader {...{ goBack, goForward, titleLabel, modalProps }} confirmModal>
        {children}
      </LayoutHeader>
    );

    const header: HTMLElement = await waitFor(() => screen.getByTestId('header'));
    const clickBackEvent: Event & { detail?: unknown } = createEvent('backBtnClicked', header);
    fireEvent(header, clickBackEvent);

    expect(layoutHeader).toBeTruthy();
    expect(header).toBeTruthy();
  });

  test('should go forward page', async () => {
    const layoutHeader = render(
      <LayoutHeader {...{ goBack, goForward, titleLabel, modalProps }} confirmModal>
        {children}
      </LayoutHeader>
    );

    const header: HTMLElement = await waitFor(() => screen.getByTestId('header'));
    const clickBackEvent: Event & { detail?: unknown } = createEvent('forwardBtnClicked', header);
    fireEvent(header, clickBackEvent);

    expect(layoutHeader).toBeTruthy();
    expect(header).toBeTruthy();
  });
});
