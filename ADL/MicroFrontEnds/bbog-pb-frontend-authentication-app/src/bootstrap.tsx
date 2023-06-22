import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { defineCustomElements } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/loader';
import { createInterceptors } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { axiosADLInstance } from '@utils/axios-instance';
import { tag } from '@utils/sherpa-tagged-components';
import './styles.scss';
import App from './App';
import store from './store';

interface Mount {
  unmount: () => void;
}

const mount = async (el: Element, navigate: (route: string) => void): Promise<Mount> => {
  const isEncrypted = !['DEV', 'LOCAL'].includes(process.env.TAG);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defineCustomElements(window, { transformTagName: tagName => `${tag}-${tagName}` } as any);
  const interceptors = await createInterceptors(isEncrypted, axiosADLInstance);
  store.dispatch({ type: 'MOUNT' });
  ReactDom.render(
    <Provider store={store}>
      <App navigate={navigate} />
    </Provider>,
    el
  );

  const unmount = () => {
    store.dispatch({ type: 'UNMOUNT' });
    ReactDom.unmountComponentAtNode(el);
    interceptors.destroy();
  };

  return { unmount };
};

if (process.env.STANDALONE === 'true') {
  const rootElement = document.getElementById('standalone-root');
  const onNavigate = route => {
    if (route === '/logout') {
      store.dispatch({ type: 'UNMOUNT' });
      sessionStorage.clear();
      window.location.reload();
    }
  };
  mount(rootElement, onNavigate);
}

export { mount };
