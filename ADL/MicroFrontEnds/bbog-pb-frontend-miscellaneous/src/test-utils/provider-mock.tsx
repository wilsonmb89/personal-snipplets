import React, { FC, ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '@store/index';

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): RenderResult => {
  const overlay = document.getElementById('overlay-root');
  if (!overlay) {
    const newOverlay = document.createElement('div');
    newOverlay.setAttribute('id', 'overlay-root');
    document.body.appendChild(newOverlay);
  }
  store.dispatch({ type: 'MOUNT' });

  const AllTheProviders: FC = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

export * from '@testing-library/react';

export { customRender as render };
