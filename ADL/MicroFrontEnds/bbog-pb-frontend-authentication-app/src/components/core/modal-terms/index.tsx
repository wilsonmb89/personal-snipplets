import React from 'react';
import ReactDom from 'react-dom';
import TermsAndConditions, { ModalTermsData } from './ModalTerms';

const rootId = 'modal-terms-overlay';

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

const showTermsAndConditionsModal = (loginData: ModalTermsData): Promise<void> => {
  return new Promise((resolve, reject) => {
    const el = document.getElementById(rootId) || createRootDomNode();
    ReactDom.render(
      <TermsAndConditions loginData={loginData} onSuccess={() => unmount(resolve)} onError={() => unmount(reject)} />,
      el
    );
  });
};

export default showTermsAndConditionsModal;
