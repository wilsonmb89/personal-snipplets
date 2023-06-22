import React from 'react';

import { render } from '../../../test-utils/provider-mock';

import LayouWrapper from './LayoutWrapper';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),

  useLocation: () => ({
    pathname: '/programadas'
  }),

  Outlet: jest.fn().mockReturnValue(null)
}));

describe('Layout wrapper component', () => {
  test('should render with the route scheduled', async () => {
    const modal = render(<LayouWrapper />);
    expect(modal).toBeTruthy();
  });
});
