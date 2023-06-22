import React from 'react';
import { createPortal } from 'react-dom';
import Modal, { ModalControls } from '../modal/Modal';

export interface ModalErrorProps {
  error: Error;
  onClose: () => void;
}

const ModalError = ({ onClose, error }: ModalErrorProps): JSX.Element => {
  const controls: ModalControls = {
    primaryAction: {
      text: 'Entendido',
      action: onClose
    },
    onClose: null
  };

  return createPortal(
    <Modal controls={controls} title={error.name} icon={'error'} message={error.message} />,
    document.getElementById('overlay-root')
  );
};

export default ModalError;
