import React from 'react';

import { createEvent, fireEvent, render, screen, waitFor } from '../../../../test-utils/provider-mock';
import { BetweenAccountPaths } from '../../constants/navigation-paths';
import EnrollAccount from './EnrollAccount';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: `/transferencias/${BetweenAccountPaths.ENROLL_ACCOUNT_HOLDER}`
  })
}));

describe('Enroll account holder page', () => {
  test('Should go to back', async () => {
    const enrollAccount = render(<EnrollAccount />);
    const header: HTMLElement = await waitFor(() => screen.getByTestId('header'));
    const clickBackEvent: Event = createEvent('backBtnClicked', header);
    fireEvent(header, clickBackEvent);

    expect(header).toBeTruthy();
    expect(enrollAccount).toBeTruthy();
  });
});
