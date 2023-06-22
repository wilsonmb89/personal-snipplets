import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { BetweenAccountPages, BetweenAccountPaths, getNavigationPath } from '../../constants/navigation-paths';
import { TransfersBdbMlBmVoucher } from '../../../../constants/sherpa-tagged-components';

import LayoutHeader from '../../../../components/core/layout-header/LayoutHeader';
import LayoutSummary from '../../../../components/core/layout-summary/LayoutSummary';
import TransferAmountForm from '../../components/transfer-amount-form/TransferAmountForm';
import TransferAccountSelect from '../../components/transfer-account-select/TransferAccountSelect';

import { useTransferAccount } from '../../hooks/useTransferAccount.hook';
import { transferAccountActions } from '../../store/transfer/account-transfer.reducer';
import { accountSelectActions } from '../../store/selected/account-selected.reducer';
import { NotificationControl, NotificationData } from '../../../../notification/Notification';
import showNotificationModal from '../../../../notification';
import styles from './TransferAccount.module.scss';
import { isEmpty } from 'lodash';

const MINIMUM_AMOUNT_FOR_TRANSFER = 0.1;

interface Step {
  step: number;
  path: string;
  rigthButtonLabel: string;
  titleLabel: string;
  hiddenBack: boolean;
  backNavigation: BetweenAccountPages;
  component: JSX.Element;
}

const TransferAccount = (): JSX.Element => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const [showBackdrop, setShowBackdrop] = useState(false);

  const {
    updateInfo,
    transferAccount,
    updatedAccountFrom,
    accountsForSelect,
    headerValues,
    detailValues,
    avatarValues,
    doTransfer,
    voucherData,
    catalogError,
    costTransaction
  } = useTransferAccount();

  useEffect(() => {
    if (catalogError) {
      dispatch(transferAccountActions.reset());
      handleError();
    }
  }, [catalogError]);

  const changeStep = () => navigate(getNavigationPath(BetweenAccountPages.TRANSFER_TO_ACCOUNT_SELECT_ACCOUNT));

  const filteredFields = detailValues.filter(detail => detail.title !== 'Valor a transferir:' || detail.value !== '-');

  const filterDetails = location.pathname.includes(BetweenAccountPaths.TRANSFER_TO_ACCOUNT_AMOUNT)
    ? filteredFields
    : detailValues;

  const addSummary = (children: JSX.Element): JSX.Element => {
    return (
      <LayoutSummary {...{ avatarValues, headerValues, detailValues: filterDetails, showBackdrop, setShowBackdrop }}>
        {children}
      </LayoutSummary>
    );
  };

  const field = (label: string, value: string, separator = false, bold = false) => {
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

  const aditionalFields = (note: string, numberOfBill: string) => {
    if (!isEmpty(note) && !isEmpty(numberOfBill)) {
      return (
        <>
          {field('Nota:', note, false, true)}
          {field('Factura:', numberOfBill)}
        </>
      );
    } else if (isEmpty(note) && !isEmpty(numberOfBill)) {
      return field('Factura:', numberOfBill, false, true);
    } else if (!isEmpty(note) && isEmpty(numberOfBill)) {
      return field('Nota:', note, false, true);
    }
  };

  const steps: Step[] = [
    {
      step: 1,
      hiddenBack: false,
      rigthButtonLabel: 'Cerrar',
      titleLabel: 'Transferencias Entre Cuentas',
      path: BetweenAccountPaths.TRANSFER_TO_ACCOUNT_AMOUNT,
      backNavigation: BetweenAccountPages.ACCOUNTS_LIST,
      component: addSummary(
        <TransferAmountForm
          infoCost={
            costTransaction?.text
              ? `Esta transacción tiene costo de $${costTransaction.text}`
              : 'Esta transacción no tiene costo adicional'
          }
          defaultValue={transferAccount}
          updateInfo={updateInfo}
          changeStep={changeStep}
          minimunAmount={MINIMUM_AMOUNT_FOR_TRANSFER}
        />
      )
    },
    {
      step: 2,
      hiddenBack: false,
      rigthButtonLabel: 'Cerrar',
      titleLabel: 'Transferencias Entre Cuentas',
      path: BetweenAccountPaths.TRANSFER_TO_ACCOUNT_SELECT_ACCOUNT,
      backNavigation: BetweenAccountPages.TRANSFER_TO_ACCOUNT_AMOUNT,
      component: addSummary(
        <TransferAccountSelect
          disableButton={transferAccount.accountFrom.description === '-'}
          updateAccount={updatedAccountFrom}
          ownAccounts={accountsForSelect}
          doTransfer={doTransfer}
        />
      )
    },
    {
      step: 3,
      hiddenBack: true,
      rigthButtonLabel: 'Abandonar',
      titleLabel: '',
      path: BetweenAccountPaths.RESULT_OF_TRANSFER,
      backNavigation: BetweenAccountPages.ACCOUNTS_LIST,
      component: (
        <TransfersBdbMlBmVoucher
          type-voucher="1"
          onButtonOk={() => {
            resetSelection();
            navigate(getNavigationPath(BetweenAccountPages.ACCOUNTS_LIST));
          }}
          data-testid="voucher"
          hiddenShare
          status={voucherData.status}
          stamp={voucherData.stamp}
          data-voucher={JSON.stringify(voucherData.voucher)}
        >
          <div slot="body-top">
            {field('', transferAccount.accountTo.productBankName)}
            {field('', transferAccount.accountTo.description)}
          </div>
          <div slot="body-bottom">
            <div className={`${styles['voucherInfo__container__bottom']}`}>
              {field(
                'Cuenta de origen:',
                transferAccount.accountFrom.description,
                !isEmpty(transferAccount.note) || !isEmpty(transferAccount.numberOfBill)
              )}
              {aditionalFields(transferAccount.note, transferAccount.numberOfBill)}
            </div>
          </div>
        </TransfersBdbMlBmVoucher>
      )
    }
  ];

  const getStep = (): Step => steps.find(step => location.pathname.includes(step.path));

  const goBack = (): void => {
    if (getStep().step === 1) dispatch(transferAccountActions.reset());
    navigate(getNavigationPath(getStep().backNavigation));
  };

  const goForward = (): void => {
    resetSelection();
    navigate(getNavigationPath(BetweenAccountPages.ACCOUNTS_LIST));
  };

  const resetSelection = () => {
    dispatch(transferAccountActions.reset());
    dispatch(accountSelectActions.reset());
  };

  const handleError = (): void => {
    const notificationDelete: NotificationData = {
      type: 'error',
      name: 'Algo ha fallado',
      message: 'En estos momentos no podemos realizar la operación. Por favor inténtalo nuevamente más tarde.'
    };
    const deleteActions: NotificationControl[] = [{ text: 'Entendido', action: () => goBack() }];
    showNotificationModal(notificationDelete, deleteActions);
  };

  return (
    <LayoutHeader
      {...{
        goBack,
        goForward,
        confirmModalForward: false,
        hiddenBack: getStep().hiddenBack,
        rigthButtonLabel: getStep().rigthButtonLabel
      }}
      titleLabel={getStep().titleLabel}
    >
      {getStep().component}
    </LayoutHeader>
  );
};

export default TransferAccount;
