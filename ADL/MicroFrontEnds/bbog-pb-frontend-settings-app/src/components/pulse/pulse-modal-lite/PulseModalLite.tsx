import { SizeModal } from '@pulse.io/components/dist/types/interface';
import React, { Fragment, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PulseModalLiteProps {
  size: SizeModal;
  willDismiss: () => void;
  children?: React.ReactNode;
  slot?: string;
}

const PulseModalLite = ({ size, children, willDismiss }: PulseModalLiteProps): JSX.Element => {
  const modalLiteRef = useRef(null);

  useEffect(() => {
    modalLiteRef.current.addEventListener('willDismiss', willDismiss);
    return () => {
      modalLiteRef.current?.removeEventListener('willDismiss', willDismiss);
    };
  }, []);

  return createPortal(
    <Fragment>
      <pulse-modal-lite ref={modalLiteRef} size={size}>
        {children}
      </pulse-modal-lite>
    </Fragment>,
    document.getElementById('overlay-root')
  );
};

export default PulseModalLite;
