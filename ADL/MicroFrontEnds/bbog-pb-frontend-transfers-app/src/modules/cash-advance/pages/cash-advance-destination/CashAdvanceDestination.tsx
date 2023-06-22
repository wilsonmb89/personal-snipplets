import React from 'react';
import { useSelector } from 'react-redux';

import styles from './CashAdvanceDestination.module.scss';
import AccountsListSelector from '@cash-advance/components/accounts-list-selector/AccountsListSelector';
import { useCashAdvanceWorkFlow } from '@cash-advance/hooks/useCashAdvanceWorkflow.hook';
import { savingsProductsWithoutAFCSelector } from '@store/products/products.select';
import { CashAdvanceSteps } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.entity';

const CashAdvanceDestination = (): JSX.Element => {
  const { destinationAcctSelected, setWorkFlowStep } = useCashAdvanceWorkFlow();

  const accounts = useSelector(savingsProductsWithoutAFCSelector);

  const submitHandler = (): void => {
    setWorkFlowStep(CashAdvanceSteps.Confirm);
  };

  return (
    <>
      {accounts && (
        <div data-testid="cash-advance-destination-container" className={styles['main-container']}>
          <div className={styles['main-container__header']}>
            <div className={`${styles['main-container__header__label']} roboto-regular sherpa-typography-body-2`}>
              Paso 2 de 2
            </div>
            <div className={`${styles['main-container__header__title']} roboto-medium sherpa-typography-title-1`}>
              ¿A qué cuenta quieres que llegue el dinero?
            </div>
            <div className={`${styles['main-container__header__desc']} roboto-regular sherpa-typography-body-2`}>
              Selecciona la cuenta de destino
            </div>
          </div>
          <div className={styles['main-container__card-list']}>
            <AccountsListSelector />
          </div>
          <div className={styles['main-container__controls']}>
            <button
              data-testid="cash-advance-destination-submit-button"
              onClick={submitHandler}
              className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
              type="button"
              disabled={!destinationAcctSelected}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CashAdvanceDestination;
