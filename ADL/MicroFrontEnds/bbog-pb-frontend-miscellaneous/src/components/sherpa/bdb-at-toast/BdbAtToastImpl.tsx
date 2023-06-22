import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';

import { MiscellaneousBdbAtToast } from '@constants/sherpaTaggedComponents';
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
  const dispatch = useDispatch();

  useEffect(() => {
    if (toastRef?.current?.show) {
      toastRef.current.show();
    }
  }, []);

  const closeToastHandler = (): void => {
    if (onDismiss) {
      onDismiss();
    }
    dispatch(dismissToast());
  };

  return createPortal(
    <MiscellaneousBdbAtToast
      data-testid="bdb-at-toast"
      ref={toastRef}
      type={type}
      titleToast={titleToast}
      message={messsage}
      onCloseToast={closeToastHandler}
    />,
    document.getElementById('overlay-root')
  );
};

export default BdbAtToastImpl;
