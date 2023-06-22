import React from 'react';
import { createPortal } from 'react-dom';
import Modal, { ModalControls } from '../modal/Modal';
import pictogramTxAlertImg from '../../../assets/pulse/pictogram-tx-alert.svg';

export interface ModalErrorProps {
  error: Error;
  onClose: () => void;
}

const ModalError = ({ onClose, error }: ModalErrorProps): JSX.Element => {
  const controls: ModalControls = {
    primaryAction: {
      text: 'Entendido',
      action: onClose
    }
  };

  return createPortal(
    <Modal controls={controls} title={error.name} icon={pictogramTxAlertImg}>
      {error.message}
    </Modal>,
    document.getElementById('overlay-root')
  );
};

export default ModalError;
