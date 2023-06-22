import React from 'react';
import { render, screen} from '../../../test-utils/provider-mock';
import '@testing-library/jest-dom';
import server from '../../../test-utils/api-mock';
import store from '../../../store';
import Header from './Header';
import userEvent from '@testing-library/user-event';

const mockedGoBack = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    goBack: mockedGoBack,
  }),
}));

describe('Header', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should render Header component', () => {
    const loginBanner = render(<Header title={'Header component'} />);
    const bannerText = screen.getByText('Header component');
    expect(loginBanner).toBeTruthy();
    expect(bannerText).toBeInTheDocument();
  });

  test('should call navigation back button', async () => {
    render(<Header title={'Header component'} />);
    const backButton = screen.getByText('Atrás');
    userEvent.click(backButton);

    expect(mockedGoBack).toHaveBeenCalled();
  })
});