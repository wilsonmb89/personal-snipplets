import React from 'react';
import { render } from '../../../test-utils/provider-mock';
import ModalError from './ModalError';

describe('Modal error component', () => {
  test('should render modal error', async () => {
    const modal = render(
      <ModalError
        callToAction={jest.fn()}
        onClose={jest.fn()}
        error={new Error('error test')}
        primaryActionText={'Entendido'}
      />
    );
    expect(modal).toBeTruthy();
  });
});
