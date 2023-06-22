import React, { Fragment, useState } from 'react';

import { MiscellaneousBdbMlBmOtp } from '../../../../constants/sherpaTaggedComponents';
import { useEffect } from 'react';
import { useNotification } from '../../hooks/useNotification.hook';
import { NotificationControl, NotificationData } from '@components/core/modal-notification/ModalNotification';
import { SEARCH_OFFICE_URL } from '@utils/constants';

export interface PhoneConfirmationModalProps {
  secureContactNumber: string;
  onConfirm: () => void;
}

const PhoneConfirmationModal = ({ secureContactNumber, onConfirm }: PhoneConfirmationModalProps): JSX.Element => {
  const [isWrongPhoneModalVisible, setWrongPhoneModalVisibility] = useState(false);

  const [maskConcatNumber] = useState(secureContactNumber.slice(-4));

  const { launchNotificationModal } = useNotification();

  useEffect(() => {
    if (isWrongPhoneModalVisible) {
      buildNotificationNotNumber();
    }
  }, [isWrongPhoneModalVisible]);

  const buildNotificationNotNumber = (): void => {
    const data: NotificationData = {
      type: 'information',
      name: '¿No es tu número de celular?',
      message: (
        <Fragment>
          Si el número no corresponde a tu celular actual, acércate a una de nuestras oficinas y actualiza tus datos.
          <br />
          <br />
          Revisa los horarios y puntos de atención en
          <b className={'sherpa-typography-title-2'}> www.bancodebogota.com</b>
        </Fragment>
      )
    };
    const controls: NotificationControl[] = [
      { text: 'Entendido', action: () => setWrongPhoneModalVisibility(false) },
      { text: 'Ver oficinas', action: viewOfficesHandler }
    ];
    launchNotificationModal(data, controls);
  };

  const viewOfficesHandler = (): void => {
    setWrongPhoneModalVisibility(false);
    window.open(SEARCH_OFFICE_URL);
  };

  return (
    <Fragment>
      <MiscellaneousBdbMlBmOtp
        data-testid="otp-confirm-form"
        telNumber={maskConcatNumber}
        onButtonClicked={onConfirm}
        onSecondButtonClicked={() => setWrongPhoneModalVisibility(true)}
      />
    </Fragment>
  );
};

export default PhoneConfirmationModal;
