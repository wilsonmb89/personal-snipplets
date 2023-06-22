import React from 'react';

import styles from './CashAdvanceEmptyState.module.scss';
import { useCashAdvanceEmptyState } from '@cash-advance/hooks/useCashAdvanceEmptyState.hook';

const CashAdvanceEmptyState = (): JSX.Element => {
  const emptyStateProps = useCashAdvanceEmptyState();

  return (
    <>
      {emptyStateProps && (
        <div
          id="cash-advance-empty-state"
          data-testid={'cash-advance-empty-state'}
          className={styles['main-container']}
        >
          <div className={styles['main-container__image-wrapper']}>
            <img src={emptyStateProps.image} alt="empty-icon" />
          </div>
          <div className={styles['main-container__body-text']}>
            {emptyStateProps.title && (
              <div
                className={`${styles['main-container__body-text__title']} roboto-medium sherpa-typography-heading-6`}
              >
                {emptyStateProps.title}
              </div>
            )}
            <div
              className={`${styles['main-container__body-text__description']} roboto-regular sherpa-typography-body-1`}
            >
              {emptyStateProps.description}
            </div>
          </div>
          {emptyStateProps.button && (
            <div className={styles['main-container__button-wrapper']}>
              <button
                id="cash-advance-empty-state-action-btn"
                data-testid={'cash-advance-empty-state-action-btn'}
                className={`${styles['main-container__button-wrapper__button']} bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg`}
                onClick={emptyStateProps.button.action}
              >
                {emptyStateProps.button.label}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CashAdvanceEmptyState;
