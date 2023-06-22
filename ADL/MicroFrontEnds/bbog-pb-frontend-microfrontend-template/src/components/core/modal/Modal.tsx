import { BdbMlModal } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/components';
import React, { useEffect, useRef } from 'react';

export interface ModalProps {
  icon?: string;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  controls: ModalControls;
}

export interface ModalControls {
  onClose: () => void | null;
  primaryAction: ModalControl;
  secondaryAction?: ModalControl;
}

interface ModalControl {
  text: string;
  action: () => void | null;
}

const Modal = ({ title, message = '', icon = '', controls }: ModalProps): JSX.Element => {
  const modalRef = useRef(null);

  useEffect(() => {
    modalRef.current.openAlert();
  }, []);

  return (
    <BdbMlModal
      ref={modalRef}
      isClose={true}
      titleModal={title}
      subTitle={message}
      icon={icon}
      optionsButtons={`[{"id":"0","value":"${controls.primaryAction.text}"}]`}
      onButtonAlertClicked={controls.onClose}
      onCloseAlert={controls.primaryAction.action}
    ></BdbMlModal>
  );
};

export default Modal;
