import React, { useEffect, useRef } from 'react';

import { MiscellaneousBdbMlModal } from '../../../constants/sherpaTaggedComponents';
export interface BdbMlModalImpProps {
  icon?: IconTypes;
  title?: string;
  message?: string;
  controls: BdbMlModalControls[];
  onClose: () => void;
}

export interface BdbMlModalControls {
  text: string;
  action?: () => void;
}

type IconTypes = 'success' | 'error' | 'warning' | 'information';

const BdbMlModalImp = ({
  title,
  message = '',
  icon = 'success',
  controls,
  onClose
}: BdbMlModalImpProps): JSX.Element => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (controls && controls.length > 0) {
      const optionButtons: { id: string; value: string }[] = [];
      controls.forEach(control => {
        optionButtons.push({ id: `modal-control-${optionButtons.length}`, value: control.text });
      });
      modalRef.current.optionsButtons = JSON.stringify(optionButtons);
      modalRef.current.isClose = false;
    } else {
      modalRef.current.hiddenButtons = true;
      modalRef.current.isClose = true;
    }
    if (modalRef.current.openAlert) {
      modalRef.current.openAlert();
    }
  }, []);

  const handleButtonClicked = (event: CustomEvent) => {
    const actionControl = controls.find(control => control.text === event.detail.value);
    if (!!actionControl && !!actionControl.action) {
      actionControl.action();
    }
  };

  return (
    <MiscellaneousBdbMlModal
      idEl="bdb-modal-info"
      data-testid="bdb-modal-info"
      ref={modalRef}
      titleModal={title}
      subTitle={message}
      icon={icon}
      onButtonAlertClicked={handleButtonClicked}
      onCloseAlert={onClose}
    />
  );
};

export default BdbMlModalImp;
