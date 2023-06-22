import React from 'react';
import store from '../../../store';
import { render, screen, waitFor } from '../../../test-utils/provider-mock';
import EmptyState from './EmptyState';
import userEvent from '@testing-library/user-event';

describe('Empty state Component', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
  });
  beforeEach(async () => {
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Should render the component EmptyState', async () => {
    const emptyState = render(<EmptyState buttonText={''} descr={''} img={''}></EmptyState>);
    expect(emptyState).toBeTruthy();
  });

  test('Should simulate link click', async () => {
    const onClickLink = jest.fn();

    render(
      <EmptyState
        img={'empty-state.svg'}
        descr={'Empty state component'}
        buttonText={'Click here'}
        buttonDisabled={true}
        descrLink={'Link here'}
        buttonIcon={'ico-add'}
        clickLink={() => onClickLink()}
      ></EmptyState>
    );

    const emptyState: HTMLElement = await waitFor(() => screen.getByTestId('empty-state'));
    const emptyStateLink = screen.getByText('Link here');
    userEvent.click(emptyStateLink);
    expect(onClickLink).toHaveBeenCalled();
    expect(emptyState).toBeTruthy();
  });

  test('Should simulate button click', async () => {
    const onClickButton = jest.fn();

    render(
      <EmptyState
        img={'empty-state.svg'}
        descr={'Empty state component'}
        buttonText={'Click here'}
        buttonIcon={'ico-add'}
        clickButton={() => onClickButton()}
      ></EmptyState>
    );

    const emptyState: HTMLElement = await waitFor(() => screen.getByTestId('empty-state'));
    const emptyStateButton = screen.getByText('Click here');
    userEvent.click(emptyStateButton);
    expect(onClickButton).toHaveBeenCalled();
    expect(emptyState).toBeTruthy();
  });
});
