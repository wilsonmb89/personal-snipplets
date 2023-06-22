import React from 'react';
import '@testing-library/jest-dom';

import { act, render, waitFor, screen } from '@test-utils/provider-mock';
import TwoAuthFactorLayout, { TwoAuthFactorLayoutProps } from './TwoAuthFactorLayout';

describe('TwoAuthFactorLayout component unit tests', () => {
  const onForwardBtnClickedHandler = jest.fn();

  const twoAuthFactorLayoutProps: TwoAuthFactorLayoutProps = {
    headerTitle: 'title test',
    onForwardBtnClicked: onForwardBtnClickedHandler
  };

  test('should load the component successfully', async () => {
    act(() => {
      render(<TwoAuthFactorLayout {...twoAuthFactorLayoutProps} />);
    });
    const element = await waitFor(() => screen.getByTestId('two-auth-factor-layout'));
    expect(element).toBeInTheDocument();
  });
});
