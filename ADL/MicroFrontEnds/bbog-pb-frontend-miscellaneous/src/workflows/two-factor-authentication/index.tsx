import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import store from '@store/index';

import TwoFactorAuthentication, { AuthData } from './TwoFactorAuthentication';
import { createInterceptors } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { axiosADLInstance } from '@utils/constants';

const rootId = 'two-factor-authentication-overlay';
const isEncrypted = !['DEV', 'LOCAL'].includes(process.env.TAG);

const validateTwoFactorAuthentication = async (authData: AuthData): Promise<void> => {
  const interceptors = await createInterceptors(isEncrypted, axiosADLInstance);
  store.dispatch({ type: 'MOUNT' });
  const unmountFlow = (resolve: () => void) => {
    interceptors.destroy();
    store.dispatch({ type: 'UNMOUNT' });
    unmount(resolve);
  };
  return new Promise((resolve, reject) => {
    const el = document.getElementById(rootId) || createRootDomNode();
    ReactDom.render(
      <Provider store={store}>
        <TwoFactorAuthentication authData={authData} onSuccess={() => unmountFlow(resolve)} onError={() => unmountFlow(reject)} />
      </Provider>,
      el
    );
  });
};

const createRootDomNode = () => {
  const el = document.createElement('div');
  el.id = rootId;
  document.body.append(el);
  return el;
};

const unmount = (finish: () => void) => {
  const el = document.getElementById(rootId);
  ReactDom.unmountComponentAtNode(el);
  finish();
};

export default validateTwoFactorAuthentication;
