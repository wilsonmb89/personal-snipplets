import React from 'react';
import { createEvent, fireEvent, render, screen, waitFor } from '../../../../test-utils/provider-mock';
import { BetweenAccountPaths } from '../../constants/navigation-paths';
import EnrollAccount from './EnrollAccount';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: `/transferencias/${BetweenAccountPaths.ENROLL_DESTINATION_ACCOUNT}`
  })
}));

describe('Enroll account page', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('Should load the page', async () => {
    const enrollAccount = render(<EnrollAccount />);
    expect(enrollAccount).toBeTruthy();
  });

  test('Should go to back', async () => {
    const enrollAccount = render(<EnrollAccount />);
    const header: HTMLElement = await waitFor(() => screen.getByTestId('header'));
    const clickBackEvent: Event = createEvent('backBtnClicked', header);
    fireEvent(header, clickBackEvent);

    const confirmModal = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    const clickOptionEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', confirmModal);
    clickOptionEvent.detail = { value: 'Sí, abandonar' };
    confirmModal.dispatchEvent(clickOptionEvent);

    expect(confirmModal.titleModal).toEqual('¿Estas seguro de abandonar la transacción?');
    expect(header).toBeTruthy();
    expect(enrollAccount).toBeTruthy();
  });

  test('Should go to forward', async () => {
    const enrollAccount = render(<EnrollAccount />);
    const header: HTMLElement = await waitFor(() => screen.getByTestId('header'));
    const clickForwardEvent: Event = createEvent('backBtnClicked', header);
    fireEvent(header, clickForwardEvent);

    const confirmModal = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    const clickOptionEvent: Event & { detail?: unknown } = createEvent('closeAlert', confirmModal);
    clickOptionEvent.detail = { value: 'No, regresar' };
    confirmModal.dispatchEvent(clickOptionEvent);

    expect(confirmModal.titleModal).toEqual('¿Estas seguro de abandonar la transacción?');
    expect(header).toBeTruthy();
    expect(enrollAccount).toBeTruthy();
  });
});
