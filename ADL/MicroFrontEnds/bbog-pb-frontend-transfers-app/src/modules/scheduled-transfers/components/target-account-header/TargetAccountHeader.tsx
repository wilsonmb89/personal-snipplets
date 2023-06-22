import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { targetAccountSelector } from '../../store/targetAccount/target-account.select';
import { createScheduledTransferActions } from '../../store/create/create.reducer';
import { useScheduledTransferValidators } from '../../hooks/useScheduledTransferValidators.hook';
import { numberToCurrency } from '../../../../utils/currency.utils';
import styles from './TargetAccountHeader.module.scss';
import { TransfersBdbAtAvatar } from '../../../../constants/sherpa-tagged-components';

const TargetAccountHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const targetAccount = useSelector(targetAccountSelector);
  const { validateAccountType } = useScheduledTransferValidators();
  const value = 6200; // TODO: Wait for the service that calculates this value.

  useEffect(() => {
    dispatch(
      createScheduledTransferActions.setAccountTo({
        accountId: targetAccount.accountId,
        accountType: targetAccount.accountType,
        bankId: targetAccount.bankId
      })
    );
  }, [targetAccount]);

  return (
    <Fragment>
      {!!targetAccount && (
        <div className={styles['header-container']}>
          <div className={styles['header-container__data']}>
            <TransfersBdbAtAvatar color="sunglow" size="md" text={targetAccount.accountAlias} />
            <div className={styles['header-container__data__info']}>
              <span className={`${styles['header-container__data__info__title']} sherpa-typography-title-1`}>
                {targetAccount.accountAlias}
              </span>
              <span className={`${styles['header-container__data__info__data-info']} sherpa-typography-body-2`}>
                {targetAccount.bankName}
              </span>
              <span className={`${styles['header-container__data__info__data-info']} sherpa-typography-body-2`}>
                {`${validateAccountType(targetAccount.accountType)} No. ${targetAccount.accountId}`}
              </span>
            </div>
          </div>
          {!targetAccount.isAval && (
            <div className={styles['header-container__card']}>
              <span className="ico-information">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </span>
              <span className={`${styles['header-container__card__text']} sherpa-typography-body-2`}>
                Recuerda que las transferencias a otros bancos pueden tardar hasta 24 horas hábiles y tiene un costo por
                transacción de {numberToCurrency(value)} + IVA.
              </span>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default TargetAccountHeader;
