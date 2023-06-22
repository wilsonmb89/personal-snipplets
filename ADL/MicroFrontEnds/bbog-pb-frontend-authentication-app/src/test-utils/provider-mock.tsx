import React, { FC, ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store';

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): RenderResult => {
  const overlay = document.createElement('div');
  overlay.setAttribute('id', 'overlay-root');
  document.body.appendChild(overlay);

  const AllTheProviders: FC = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

const customUnrender = (): void => {
  const overlay = document.getElementById('overlay-root');
  if (overlay) {
    document.body.removeChild(overlay);
  }
};

export * from '@testing-library/react';

export { customRender as render };
export { customUnrender as unrender };
