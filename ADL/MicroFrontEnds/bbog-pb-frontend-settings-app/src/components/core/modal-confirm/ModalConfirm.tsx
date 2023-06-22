import React from 'react';
import { createPortal } from 'react-dom';
import Modal, { ModalControls } from '../modal/Modal';
import pictogramTxAlertImg from '../../../assets/pulse/pictogram-tx-alert.svg';

export interface ModalConfirmProps {
  title: string;
  description: string;
  modalConfirmControls: ModalControls;
}

const ModalConfirm = ({ title, description, modalConfirmControls }: ModalConfirmProps): JSX.Element => {
  return createPortal(
    <Modal controls={modalConfirmControls} title={title} icon={pictogramTxAlertImg}>
      {description}
    </Modal>,
    document.getElementById('overlay-root')
  );
};

export default ModalConfirm;
