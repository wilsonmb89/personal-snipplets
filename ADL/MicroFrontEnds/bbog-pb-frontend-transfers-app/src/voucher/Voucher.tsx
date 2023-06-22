import approved from '../assets/img/approved.svg';
import paid from '../assets/img/paid.svg';
import { IAttributesVoucher } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components/sherpa-ml/bdb-ml-bm-voucher/IAttributesVoucher';
import React, { ReactElement } from 'react';
import { TransfersBdbMlBmVoucher, TransfersBdbMlHeaderBv } from '../constants/sherpa-tagged-components';
import { VoucherStamp, VoucherState, VoucherType, VoucherStamps } from './voucher.types';
import styles from './Voucher.module.scss';

export interface VoucherControls {
  buttonLabel?: string;
  hiddenShare?: boolean;
  stamp?: VoucherStamp;
  state?: VoucherState;
  typeVoucher?: VoucherType;
  rigthButtonLabel?: string;
}

export interface VoucherEvents {
  onButtonOk?: () => void;
  onButtonShare?: () => void;
  onPaymentError?: () => void;
  onExit?: () => void;
}

export interface VoucherData {
  data: IAttributesVoucher;
  bodyTop?: ReactElement;
  bodyBottom?: ReactElement;
}

interface VoucherProps extends VoucherData, VoucherControls, VoucherEvents {}

const Voucher = ({
  data,
  buttonLabel,
  hiddenShare,
  stamp,
  state,
  typeVoucher,
  bodyTop,
  bodyBottom,
  rigthButtonLabel = 'Cerrar',
  onButtonOk,
  onButtonShare,
  onPaymentError,
  onExit
}: VoucherProps): JSX.Element => {
  const getUrlStamp = (): string => {
    switch (stamp) {
      case VoucherStamps.APPROVED:
        return approved;
      case VoucherStamps.PAID:
        return paid;
      default:
        return '';
    }
  };

  return (
    <div data-testid="voucher" className={styles['voucher']}>
      <TransfersBdbMlHeaderBv
        className={styles['voucher__header']}
        data-testid="voucher-header"
        rigthButtonLabel={rigthButtonLabel}
        hiddenBack={true}
        rigthIcon="ico-close"
        onForwardBtnClicked={onExit}
      />
      <div className={styles['voucher__container']}>
        <TransfersBdbMlBmVoucher
          className={styles['voucher__voucher']}
          dataVoucher={data}
          buttonLabel={buttonLabel}
          hiddenShare={hiddenShare}
          urlStamp={getUrlStamp()}
          status={state}
          typeVoucher={typeVoucher}
          onButtonOk={onButtonOk}
          onButtonShare={onButtonShare}
          onPaymentError={onPaymentError}
        >
          <div slot="body-top">{bodyTop}</div>
          <div slot="body-bottom">{bodyBottom}</div>
        </TransfersBdbMlBmVoucher>
      </div>
    </div>
  );
};

export default Voucher;
