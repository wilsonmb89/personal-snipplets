import React from 'react';
import { render } from '../../../test-utils/provider-mock';
import Modal, { ModalControls } from './Modal';

describe('Modal component', () => {
  test('Render modal component', async () => {
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

    const modal = render(<Modal controls={controls} />);
    expect(modal).toBeTruthy();
  });
});
