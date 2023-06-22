import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { defineCustomElements } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/loader';

import './styles.scss';
import App from './App';
import store from './store';
import { tag } from './constants/sherpa-tagged-components';
import { createInterceptors, promptLogin } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { LoginConfig } from '@avaldigitallabs/bbog-pb-lib-frontend-commons/build/auth/login.model';
import { axiosADLInstance } from '@utils/constants';
import { getRecaptchaToken } from '@utils/recaptcha';
import { createLogoutInterceptor } from '@utils/logout.interceptor';
interface Mount {
  unmount: () => void;
}

const isEncrypted = !['DEV', 'LOCAL'].includes(process.env.TAG);

const mount = async (el: Element, navigate: (route: string) => void): Promise<Mount> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defineCustomElements(window, { transformTagName: tagName => `${tag}-${tagName}` } as any);
  const interceptors = await createInterceptors(isEncrypted, axiosADLInstance);
  const logoutInterceptor = createLogoutInterceptor(axiosADLInstance, navigate);
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
    logoutInterceptor.destroy();
  };

  return { unmount };
};

if (process.env.STANDALONE === 'true') {
  getRecaptchaToken().then(
    recaptchaToken => {
      const loginConfig: LoginConfig = { host: process.env.API_URL, encryptBody: isEncrypted };
      const rootElement = document.getElementById('standalone-root');
      const onNavigate = route => {
        if (route === '/logout') {
          store.dispatch({ type: 'UNMOUNT' });
          sessionStorage.clear();
          window.location.reload();
        }
      };
      if (sessionStorage.getItem(btoa('AuthState'))) {
        mount(rootElement, onNavigate);
      } else {
        promptLogin(loginConfig, recaptchaToken).then(
          () => mount(rootElement, onNavigate),
          error => console.error(error)
        );
      }
    },
    () => console.error('Error getting token.')
  );
}

export { mount };
