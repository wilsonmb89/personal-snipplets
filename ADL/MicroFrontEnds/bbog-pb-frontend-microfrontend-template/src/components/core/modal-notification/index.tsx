import React from 'react';
import ReactDom from 'react-dom';
import store from '../../../store';
import { Provider } from 'react-redux';
import Notification, { NotificationControl, NotificationData } from './ModalNotification';

const rootId = 'notification-modal-overlay';

const showNotificationModal = (data: NotificationData, actions: NotificationControl[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const el = document.getElementById(rootId) || createRootDomNode();
    ReactDom.render(
      <Provider store={store}>
        <Notification
          data={data}
          actions={actions}
          onSuccess={() => unmount(resolve)}
          onError={() => unmount(reject)}
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

const unmount = (finish: () => void) => {
  const el = document.getElementById(rootId);
  ReactDom.unmountComponentAtNode(el);
  finish();
};

export default showNotificationModal;
