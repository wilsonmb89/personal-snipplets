import React from 'react';
import '@testing-library/jest-dom';

import Loader from './Loader';
import { act, screen, render, waitFor } from '@test-utils/provider-mock';

describe('Loader component unit tests', () => {
  test('should load the component successfully', async () => {
    act(() => {
      render(<Loader />);
    });
    const element = await waitFor(() => screen.getByTestId('loader'));
    expect(element).toBeInTheDocument();
  });
});
