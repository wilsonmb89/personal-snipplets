import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import App from './App';
import { render, waitFor, screen, act } from './test-utils/provider-mock';
import { loadingActions } from '@store/loader/loader.store';
import store from '@store/index';
import { showToast } from '@store/toast/toast.store';

describe('App unit tests', () => {
  test('should start the application succesfully', () => {
    const app = render(<App />);
    expect(app).toBeTruthy();
  });

  test('should show the loader', async () => {
    store.dispatch(loadingActions.enable());
    act(() => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });

    const loader = await waitFor(() => screen.getByTestId('loader'));
    expect(loader).toBeInTheDocument();

    store.dispatch(loadingActions.disable());
    expect(loader).not.toBeInTheDocument();
  });

  test('should show the toast', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });

    store.dispatch(
      showToast({
        title: 'toast test',
        message: 'toast message',
        type: 'success'
      })
    );
    const element = await waitFor(() => screen.getByTestId('bdb-at-toast'));
    expect(element).toBeInTheDocument();
  });
});
