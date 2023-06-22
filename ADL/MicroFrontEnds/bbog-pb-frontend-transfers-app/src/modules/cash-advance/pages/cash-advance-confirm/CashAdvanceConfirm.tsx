import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './CashAdvanceConfirm.module.scss';
import showNotificationModal from '../../../../notification';
import { TransfersBdbMlConfirmation } from '@constants/sherpa-tagged-components';
import { cashAdvanceWorkflowSelector } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.select';
import { cashAdvanceWorkflowActions } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.reducer';
import { CashAdvanceSteps } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.entity';
import { NotificationControl, NotificationData } from '../../../../notification/Notification';
import { fetchCashAdvance } from '@cash-advance/store/cash-advance/cash-advance.effect';
import { AppDispatch } from '@store/index';
import { DEFAULT_TRANSACTION_COST } from '@cash-advance/constants/utilsConstants';

interface ConfirmItem {
  id: string;
  section: Section[];
  hideEdit?: boolean;
}

interface Section {
  text?: string;
  value: string;
  bold?: boolean;
  decimals?: string;
}

const CashAdvanceConfirm = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

  const { cardSelected, advanceAmount, destinationAcct, transactionCost } = useSelector(cashAdvanceWorkflowSelector);

  const [confirmationData, setConfirmationData] = useState<string>('[]');

  useEffect(() => {
    const ccSelectedItem: ConfirmItem = {
      id: `${CashAdvanceSteps.List}`,
      section: [
        {
          text: 'Tarjeta Origen:',
          value: cardSelected?.productName || '-',
          bold: true
        },
        { value: cardSelected?.description || '-' },
        { value: cardSelected?.productNumber ? `No. **** ${cardSelected.productNumber.slice(-4)}` : '-' }
      ],
      hideEdit: false
    };
    const amountItem: ConfirmItem = {
      id: `${CashAdvanceSteps.Amount}`,
      section: [
        {
          text: 'Monto:',
          value: `${advanceAmount ? '$ ' + advanceAmount : '-'}`,
          bold: false
        }
      ],
      hideEdit: false
    };
    const destinationAcctItem: ConfirmItem = {
      id: `${CashAdvanceSteps.Destination}`,
      section: [
        {
          text: 'Cuenta destino:',
          value: destinationAcct?.productName || '-',
          bold: true
        },
        { value: destinationAcct?.description || '-' },
        { value: destinationAcct?.productNumber ? `No. ${destinationAcct.productNumber}` : '-' }
      ],
      hideEdit: false
    };
    const trxAmtItem: ConfirmItem = {
      id: 'amount_selected',
      section: [
        {
          text: 'Costo:',
          value: transactionCost || DEFAULT_TRANSACTION_COST,
          bold: true
        }
      ],
      hideEdit: true
    };
    const componentData: ConfirmItem[] = [ccSelectedItem, amountItem, destinationAcctItem, trxAmtItem];
    setConfirmationData(JSON.stringify(componentData));
  }, [cardSelected, advanceAmount, destinationAcct]);

  const onClickConfirmHandler = (): void => {
    dispatch(fetchCashAdvance()).finally(() => dispatch(cashAdvanceWorkflowActions.setStep(CashAdvanceSteps.Result)));
  };

  const onEditClickButtonHandler = ({
    detail: {
      card: { id }
    }
  }): void => {
    const stepCode = +id;
    if (stepCode === CashAdvanceSteps.List) {
      showListPageWarning();
    } else {
      dispatch(cashAdvanceWorkflowActions.setStep(+id));
    }
  };

  const showListPageWarning = (): void => {
    const modalData: NotificationData = {
      type: 'warning',
      name: '¿Quieres cambiar la tarjeta origen?',
      message: 'Al editar la tarjeta origen del avance deberás volver a repetir los pasos del proceso'
    };
    const modalActions: NotificationControl[] = [
      {
        text: 'Si, editar',
        action: () => dispatch(cashAdvanceWorkflowActions.setStep(CashAdvanceSteps.List))
      },
      { text: 'No, regresar' }
    ];
    showNotificationModal(modalData, modalActions);
  };

  return (
    <div className={styles['main-container']}>
      <TransfersBdbMlConfirmation
        idEl="cash-advance-confirmation"
        data-testid="cash-advance-confirmation"
        confirmationData={confirmationData}
        confTitle="Confirmar avance"
        buttonTitle="Realizar avance"
        onClickButton={onClickConfirmHandler}
        onEditClickButton={onEditClickButtonHandler}
      />
    </div>
  );
};

export default CashAdvanceConfirm;
