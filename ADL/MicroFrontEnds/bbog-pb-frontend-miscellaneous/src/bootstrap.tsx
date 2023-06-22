import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { defineCustomElements } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/loader';

import './styles.scss';
import App from './App';
import store from './store';
import validateTwoFactorAuthentication from './workflows/two-factor-authentication';
import { promptLogin } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { LoginConfig } from '@avaldigitallabs/bbog-pb-lib-frontend-commons/build/auth/login.model';
import { getRecaptchaToken } from './services/recaptcha';
import { tag } from './constants/sherpaTaggedComponents';

interface Mount {
  unmount: () => void;
  sharedWorkflows: SharedWorkflows;
}

interface SharedWorkflows {
  [key: string]: unknown;
}

const isEncrypted = !['DEV', 'LOCAL'].includes(process.env.TAG);

const mount = async (el: Element): Promise<Mount> => {
  const sharedWorkflows: SharedWorkflows = {
    ['validateTwoFactorAuthentication']: validateTwoFactorAuthentication
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defineCustomElements(window, { transformTagName: tagName => `${tag}-${tagName}` } as any);
  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    el
  );

  const unmount = () => {
    ReactDom.unmountComponentAtNode(el);
  };

  return { unmount, sharedWorkflows };
};

if (process.env.STANDALONE === 'true') {
  getRecaptchaToken().then(
    recaptchaToken => {
      const loginConfig: LoginConfig = { host: process.env.API_URL, encryptBody: isEncrypted };
      const rootElement = document.getElementById('standalone-root');
      if (sessionStorage.getItem(btoa('AuthState'))) {
        mount(rootElement);
      } else {
        promptLogin(loginConfig, recaptchaToken).then(
          () => mount(rootElement),
          error => console.error(error)
        );
      }
    },
    () => console.error('Error getting token.')
  );
}
export { mount };
