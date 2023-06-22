import React from 'react';

import { render } from '../../../test-utils/provider-mock';
import { ModalControls } from '../modal/Modal';

import ModalConfirm from './ModalConfirm';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),

  useLocation: () => ({
    pathname: '/programadas'
  }),

  Outlet: jest.fn().mockReturnValue(null)
}));

describe('Modal confirm component', () => {
  test('should render modal confirm', async () => {
    const controls: ModalControls = {
      onClose: jest.fn(),
      primaryAction: {
        text: 'primary action',
        action: jest.fn()
      },
      secondaryAction: {
        text: 'secondary action',
        action: jest.fn()
      }
    };

    const modal = render(
      <ModalConfirm modalConfirmControls={controls} description="desc" title="title" key="mi-test" />
    );

    expect(modal).toBeTruthy();
  });
});
