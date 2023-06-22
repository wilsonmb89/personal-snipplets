import React, { Fragment, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import image from '../../../assets/pulse/success-toast.svg';

export interface PulseToastProps {
  text: string;
  onClose: () => void;
}

const PulseToast = ({ text, onClose }: PulseToastProps): JSX.Element => {
  const toastRef = useRef(null);

  useEffect(() => {
    toastRef.current.addEventListener('toastClosed', onClose);
    return () => {
      toastRef.current?.removeEventListener('toastClosed', onClose);
    };
  }, []);

  return createPortal(
    <Fragment>
      <pulse-toast
        data-testid="pulse-toast"
        role="dialog"
        ref={toastRef}
        image={image}
        time={4000}
        text={text}
      ></pulse-toast>
    </Fragment>,
    document.getElementById('overlay-root')
  );
};

export default PulseToast;
