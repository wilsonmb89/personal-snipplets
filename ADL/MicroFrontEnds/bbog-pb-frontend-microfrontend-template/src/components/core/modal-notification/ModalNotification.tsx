import React, { useEffect, useRef } from 'react';
import { BdbMlModal } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/components';

export interface NotificationProps {
  data: NotificationData;
  actions: NotificationControl[];
  onSuccess: () => void;
  onError: () => void;
}

export interface NotificationData {
  type: NotificationTypes;
  name: string;
  message: string;
  stackError?: string;
}

type NotificationTypes = 'success' | 'error' | 'warning' | 'information';

export interface NotificationControl {
  text: string;
  action: () => void;
}

const ModalNotification = ({ data, actions, onSuccess, onError }: NotificationProps): JSX.Element => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (actions && actions.length > 0) {
      const optionButtons: { id: string; value: string }[] = [];
      actions.forEach(control => {
        optionButtons.push({ id: `notification-modal-button-${optionButtons.length}`, value: control.text });
      });
      modalRef.current.optionsButtons = JSON.stringify(optionButtons);
      modalRef.current.isClose = false;
    } else {
      modalRef.current.hiddenButtons = true;
      modalRef.current.isClose = true;
    }
    if (modalRef.current.openAlert) {
      modalRef.current.openAlert();
    }
  }, []);

  const handleButtonClicked = (event: CustomEvent) => {
    try {
      const actionControl = actions.find(control => control.text === event.detail.value);
      if (!!actionControl && !!actionControl.action) {
        actionControl.action();
      }
      onSuccess();
    } catch (error) {
      onError();
    }
  };

  return (
    <BdbMlModal
      data-testid="notification-modal"
      ref={modalRef}
      titleModal={data.name}
      subTitle={data.message}
      icon={data.type}
      onButtonAlertClicked={handleButtonClicked}
      onCloseAlert={onSuccess}
    ></BdbMlModal>
  );
};

export default ModalNotification;
