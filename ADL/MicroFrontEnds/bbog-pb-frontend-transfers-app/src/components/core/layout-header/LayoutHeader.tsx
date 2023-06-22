import React, { Fragment } from 'react';
import { TransfersBdbMlHeaderBv } from '../../../constants/sherpa-tagged-components';
import showNotificationModal from '../../../notification';
import { NotificationControl, NotificationData } from '../../../notification/Notification';
import version from '../../../version';
import Layout from '../layout/Layout';
import styles from './LayoutHeader.module.scss';

interface LayoutHeaderProps {
  children: React.ReactNode;
  titleLabel: string;
  confirmModal?: boolean;
  confirmModalForward?: boolean;
  modalProps?: NotificationData;
  leftButtonLabel?: string;
  rigthButtonLabel?: string;
  rigthIcon?: string;
  goBack(): void;
  goForward(): void;
  hiddenBack?: boolean;
}

const LayoutHeader = ({
  children,
  titleLabel,
  confirmModal = false,
  confirmModalForward = true,
  modalProps,
  leftButtonLabel = 'Atras',
  rigthButtonLabel = 'Abandonar',
  rigthIcon = 'ico-close',
  hiddenBack = false,
  goBack,
  goForward
}: LayoutHeaderProps): JSX.Element => {
  const confirmGoOut = (action: () => void): void => {
    const notificationGoOut: NotificationData = {
      type: modalProps.type,
      name: modalProps.name,
      message: modalProps?.message
    };
    const confirmActions: NotificationControl[] = [{ text: 'Sí, abandonar', action }, { text: 'No, regresar' }];
    showNotificationModal(notificationGoOut, confirmActions);
  };

  return (
    <Fragment>
      <TransfersBdbMlHeaderBv
        data-testid="header"
        {...{ leftButtonLabel, rigthButtonLabel, rigthIcon, titleLabel }}
        onBackBtnClicked={confirmModal ? () => confirmGoOut(goBack) : goBack}
        onForwardBtnClicked={confirmModalForward ? () => confirmGoOut(goForward) : goForward}
        hiddenBack={hiddenBack}
      />
      <div className={styles['layout-header__container']}>
        <Layout slot="content">{children}</Layout>
      </div>
      <div className={`${styles['layout-header__version']} sherpa-typography-overline-1`}>{`V.${version}`}</div>
    </Fragment>
  );
};

export default LayoutHeader;
