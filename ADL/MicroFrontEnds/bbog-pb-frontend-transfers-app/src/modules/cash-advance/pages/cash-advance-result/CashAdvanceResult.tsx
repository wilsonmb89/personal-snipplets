import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './CashAdvanceResult.module.scss';
import approved from '@assets/img/approved.svg';
import paid from '@assets/img/paid.svg';
import { cashAdvanceWorkflowSelector } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.select';
import { TransfersBdbMlBmVoucher } from '@constants/sherpa-tagged-components';
import { useCashAdvanceResult } from '@cash-advance/hooks/useCashAdvanceResult.hook';
import { cashAdvanceWorkflowActions } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.reducer';
import { fetchCashAdvance } from '@cash-advance/store/cash-advance/cash-advance.effect';
import { useCashAdvanceNavigation } from '@cash-advance/hooks/useCashAdvanceNavigation.hook';
import { VoucherStamps } from '../../../../voucher/voucher.types';

interface VoucherCallToAction {
  buttonLabel: string;
  onButtonOk: () => void;
}

const CashAdvanceResult = (): JSX.Element => {
  const dispatch = useDispatch();

  const [urlStamp, setUrlStamp] = useState<string>(null);

  const { rootRedirect } = useCashAdvanceNavigation();
  const { cardSelected, destinationAcct, transactionCost, fetchApiResult } = useSelector(cashAdvanceWorkflowSelector);
  const { stamp, status, voucher } = useCashAdvanceResult();

  useEffect(() => {
    getUrlStamp();
  }, [stamp]);

  const buildField = (label: string, value: string, separator = false, bold = false) => {
    return (
      <div className={`${styles['voucherInfo__container']} ${separator ? `${styles['voucherInfo__separator']}` : ''}`}>
        <div className={`${styles['voucherInfo__normal']} sherpa-typography-body-2`}>{label}</div>
        <div
          className={`${styles['voucherInfo__fieldRigth']} ${
            bold ? 'sherpa-typography-title-2' : `${styles['voucherInfo__normal']} sherpa-typography-body-2`
          }`}
        >
          {value}
        </div>
      </div>
    );
  };

  const buildCallToAction = (): VoucherCallToAction => {
    if (status === 'SUCCESS') {
      return {
        buttonLabel: 'Otro avance',
        onButtonOk: () => dispatch(cashAdvanceWorkflowActions.reset())
      };
    } else {
      const {
        error: { attemps }
      } = fetchApiResult;
      if (attemps > 2) {
        return {
          buttonLabel: 'Entendido',
          onButtonOk: () => rootRedirect()
        };
      }
      return {
        buttonLabel: 'Intentar de nuevo',
        onButtonOk: () => dispatch(fetchCashAdvance())
      };
    }
  };

  const getAccountNameByType = (accType: string): string => {
    const accountName = {
      SDA: 'Ahorros',
      DDA: 'Corriente'
    }[accType];
    return accountName ? accountName : 'Ahorros';
  };

  const getUrlStamp = (): void => {
    switch (stamp) {
      case VoucherStamps.APPROVED:
        setUrlStamp(approved);
        break;
      case VoucherStamps.PAID:
        setUrlStamp(paid);
        break;
      default:
        setUrlStamp(null);
    }
  };

  return (
    <div className={styles['voucherInfo']}>
      {voucher && (
        <TransfersBdbMlBmVoucher
          data-testid="cash-advance-voucher"
          hiddenShare
          typeVoucher={1}
          urlStamp={urlStamp}
          status={status}
          dataVoucher={voucher}
          titleVoucher="Valor del avance"
          {...buildCallToAction()}
        >
          <div slot="body-top">
            {buildField('Destino', destinationAcct?.productName || '-', false, true)}
            {buildField('', destinationAcct?.description || '-', false, true)}
            {buildField('', 'Banco de Bogotá')}
            {buildField(
              '',
              destinationAcct?.productNumber && destinationAcct?.productBankType
                ? `${getAccountNameByType(destinationAcct.productBankType)} No. ${destinationAcct.productNumber}`
                : '-'
            )}
          </div>
          <div slot="body-bottom">
            <div className={`${styles['voucherInfo__container__bottom']}`}>
              {buildField('Costo de la transacción', transactionCost, false, true)}
              {buildField(
                'Origen',
                cardSelected?.productNumber
                  ? `${cardSelected.description} No. **** ${cardSelected.productNumber.slice(-4)}`
                  : '-'
              )}
            </div>
          </div>
        </TransfersBdbMlBmVoucher>
      )}
    </div>
  );
};

export default CashAdvanceResult;
