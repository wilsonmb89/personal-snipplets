import React from 'react';
import { TransfersBdbCardPrice } from '../../../../constants/sherpa-tagged-components';
import { ItemData } from '../../hooks/useTransferAccount.hook';
import styles from './TransferAccountSelect.module.scss';

interface AccountSelectProps {
  ownAccounts: ItemData[];
  updateAccount(value: ItemData): void;
  disableButton: boolean;
  doTransfer(): void;
}

const TransferAccountSelect = ({
  ownAccounts,
  updateAccount,
  disableButton,
  doTransfer
}: AccountSelectProps): JSX.Element => {
  return (
    <div className={styles['container']}>
      <div className={`${styles['container--step']} sherpa-typography-label-1`}>Paso 2 de 2</div>
      <span className={`${styles['container--question']} sherpa-typography-heading-6`}>
        ¿Desde dónde vas a transferir?
      </span>
      <div className={`${styles['container--aditional-info']} sherpa-typography-label-1`}>
        Selecciona la cuenta para debitar
      </div>
      <TransfersBdbCardPrice
        data-testid="account-selector"
        onCardSelected={event => updateAccount(event.detail)}
        values-cards={JSON.stringify(ownAccounts)}
      />
      <div className={styles['container__actions']}>
        <button
          disabled={disableButton}
          onClick={() => doTransfer()}
          type="button"
          data-testid="transfer-button"
          className={`${styles['container__actions--transfer']} bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg`}
        >
          Transferir
        </button>
      </div>
    </div>
  );
};

export default TransferAccountSelect;
