import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { dismissToast, Toasts } from '../../../store/toast/toast.store';
import { TransfersBdbAtToast } from '../../../constants/sherpa-tagged-components';
import { globalFunctions } from '../../../global-functions';

export interface BdbAtToastImplProps {
  type?: string;
  titleToast?: string;
  textLink?: string;
  textDesc?: string;
  message?: string;
  onLinkClick?: () => void;
  onDismiss?: () => void;
}

const BdbAtToastImpl = ({
  message = '',
  type = Toasts.SUCCESS,
  titleToast = null,
  textLink = null,
  textDesc = null,
  onLinkClick,
  onDismiss
}: BdbAtToastImplProps): JSX.Element => {
  const toastRef = useRef(null);
  const distpatch = useDispatch();

  useEffect(() => {
    if (toastRef.current.show) toastRef.current.show();
  }, []);

  const closeToastHandler = () => {
    if (onDismiss) {
      onDismiss();
    }
    distpatch(dismissToast());
  };

  const linkClickHandler = () => {
    if (onLinkClick) {
      onLinkClick();
      globalFunctions.toastFn = null;
    }
    distpatch(dismissToast());
  };

  return createPortal(
    <TransfersBdbAtToast
      data-testid="toast"
      ref={toastRef}
      type={type}
      titleToast={titleToast}
      textDesc={textDesc}
      message={message}
      textLink={textLink}
      onCloseToast={closeToastHandler}
      onLinkClick={linkClickHandler}
    ></TransfersBdbAtToast>,
    document.getElementById('overlay-root')
  );
};

export default BdbAtToastImpl;
