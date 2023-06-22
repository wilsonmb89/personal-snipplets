import React from 'react';
import { render } from '../../../test-utils/provider-mock';
import Loader from './Loader';

describe('Loader component', () => {
  test('should render loader', async () => {
    const loader = render(<Loader />);
    expect(loader).toBeTruthy();
  });
});
