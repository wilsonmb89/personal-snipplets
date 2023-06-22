import React from 'react';
import Voucher, { VoucherControls, VoucherData, VoucherEvents } from './Voucher';
import ReactDom from 'react-dom';
import store from '../store';
import { Provider } from 'react-redux';

const rootId = 'overlay-root';

const showVoucher = (data: VoucherData, controls: VoucherControls, events: VoucherEvents): Promise<void> => {
  return new Promise((resolve, reject) => {
    const el = document.getElementById(rootId) || createRootDomNode();
    ReactDom.render(
      <Provider store={store}>
        <Voucher
          {...data}
          {...controls}
          onButtonOk={() => {
            callToAction(events.onButtonOk);
            unmount(resolve);
          }}
          onButtonShare={() => {
            callToAction(events.onButtonShare);
          }}
          onExit={() => {
            callToAction(events.onExit);
            unmount(resolve);
          }}
          onPaymentError={() => {
            callToAction(events.onPaymentError);
            unmount(reject);
          }}
        />
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

const callToAction = (fn: () => void) => {
  if (fn) {
    fn();
  }
};

const unmount = (finish: () => void) => {
  const el = document.getElementById(rootId);
  ReactDom.unmountComponentAtNode(el);
  finish();
};

export default showVoucher;
