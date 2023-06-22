import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BdbAtToast } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/components';
import { useDispatch } from 'react-redux';
import { dismissToast } from '../../../store/toast/toast.store';

export interface BdbAtToastImplProps {
  type?: string;
  titleToast?: string;
  messsage: string;
  onDismiss?: () => void;
}

const BdbAtToastImpl = ({
  messsage,
  type = 'SUCCESS',
  titleToast = '',
  onDismiss
}: BdbAtToastImplProps): JSX.Element => {
  const toastRef = useRef(null);
  const distpatch = useDispatch();

  useEffect(() => {
    toastRef.current.show();
  }, []);

  const closeToastHandler = () => {
    if (onDismiss) {
      onDismiss();
    }
    distpatch(dismissToast());
  };

  return createPortal(
    <BdbAtToast
      ref={toastRef}
      type={type}
      titleToast={titleToast}
      message={messsage}
      onCloseToast={closeToastHandler}
    ></BdbAtToast>,
    document.getElementById('overlay-root')
  );
};

export default BdbAtToastImpl;
