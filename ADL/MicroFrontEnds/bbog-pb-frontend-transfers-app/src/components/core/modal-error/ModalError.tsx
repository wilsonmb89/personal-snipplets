import React from 'react';
import { createPortal } from 'react-dom';
import Modal, { ModalControls } from '../modal/Modal';

export interface ModalErrorProps {
  error: Error;
  primaryActionText: string;
  callToAction: () => void;
  onClose: () => void;
}

const ModalError = ({ callToAction, onClose, error, primaryActionText }: ModalErrorProps): JSX.Element => {
  const controls: ModalControls = {
    primaryAction: {
      text: primaryActionText,
      action: callToAction
    },
    onClose: onClose
  };

  return createPortal(
    <Modal controls={controls} title={error.name} icon={'error'} message={error.message} />,
    document.getElementById('overlay-root')
  );
};

export default ModalError;
