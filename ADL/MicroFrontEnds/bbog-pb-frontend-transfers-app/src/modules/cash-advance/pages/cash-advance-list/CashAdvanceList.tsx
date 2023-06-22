import React from 'react';

import styles from './CashAdvanceList.module.scss';
import CreditCardList from '@cash-advance/components/credit-card-list/CreditCardList';
import { useCashAdvanceWorkFlow } from '@cash-advance/hooks/useCashAdvanceWorkflow.hook';

const CashAdvanceList = (): JSX.Element => {
  const { creditCards } = useCashAdvanceWorkFlow();

  return (
    <>
      {creditCards && (
        <div data-testid="cash-advance-list-container" className={styles['main-container']}>
          <div className={styles['main-container__title-text']}>
            <div className={`${styles['main-container__title-text__title']} roboto-medium sherpa-typography-heading-6`}>
              ¿Desde que tarjeta vas a realizar el avance?
            </div>
            <div className={`${styles['main-container__title-text__desc']} roboto-regular sherpa-typography-body-2`}>
              Selecciona la tarjeta de la cual quieres hacer el avance:
            </div>
          </div>
          <div className={styles['main-container__card-list']}>
            <CreditCardList />
          </div>
        </div>
      )}
    </>
  );
};

export default CashAdvanceList;
