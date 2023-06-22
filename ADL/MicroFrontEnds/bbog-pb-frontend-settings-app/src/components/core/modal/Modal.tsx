import React from 'react';
import PulseModalLite from '../../pulse/pulse-modal-lite/PulseModalLite';
import styles from './Modal.module.scss';

export interface ModalProps {
  icon?: string;
  title?: string;
  children?: React.ReactNode;
  controls?: ModalControls;
}

export interface ModalControls {
  onClose?: () => void | null;
  primaryAction?: ModalControl;
  secondaryAction?: ModalControl;
}

interface ModalControl {
  text: string;
  action: () => void | null;
}

const Modal = ({ title, icon, children, controls }: ModalProps): JSX.Element => {
  return (
    <PulseModalLite size="default" willDismiss={null}>
      <pulse-modaltb>
        {!!controls && !!controls.onClose && (
          <div slot="header">
            <div className={styles['modal-container__btn-close']} onClick={controls.onClose}>
              <pulse-icon icon="close"></pulse-icon>
            </div>
          </div>
        )}
        <div slot="content">
          <pulse-modaltc title={null}>
            <div slot="icon">
              <img src={icon} />
            </div>
            <div slot="title">{title}</div>
            <div slot="body">{children}</div>
          </pulse-modaltc>
        </div>
        <div slot="footer">
          <div className={styles['modal-container__footer']}>
            {!!controls && !!controls.secondaryAction && (
              <div className={styles['modal-container__footer__action-btn']}>
                <pulse-button
                  colorgradient={true}
                  block={true}
                  fill={'outline'}
                  onClick={controls.secondaryAction.action}
                >
                  {controls.secondaryAction.text}
                </pulse-button>
              </div>
            )}
            {!!controls && !!controls.primaryAction && (
              <div className={styles['modal-container__footer__action-btn']}>
                <pulse-button colorgradient={true} block={true} onClick={controls.primaryAction.action}>
                  {controls.primaryAction.text}
                </pulse-button>
              </div>
            )}
          </div>
        </div>
      </pulse-modaltb>
    </PulseModalLite>
  );
};

export default Modal;
