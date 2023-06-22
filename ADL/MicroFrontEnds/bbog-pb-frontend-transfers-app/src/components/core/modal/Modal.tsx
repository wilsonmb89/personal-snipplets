import React, { useEffect, useRef } from 'react';
import { TransfersBdbMlModal } from '../../../constants/sherpa-tagged-components';

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
    if (modalRef.current.openAlert) modalRef.current.openAlert();
  }, []);

  return (
    <TransfersBdbMlModal
      ref={modalRef}
      isClose={true}
      titleModal={title}
      subTitle={message}
      icon={icon}
      optionsButtons={`[{"id":"0","value":"${controls.primaryAction.text}"}]`}
      onButtonAlertClicked={controls.onClose}
      onCloseAlert={controls.primaryAction.action}
    ></TransfersBdbMlModal>
  );
};

export default Modal;
