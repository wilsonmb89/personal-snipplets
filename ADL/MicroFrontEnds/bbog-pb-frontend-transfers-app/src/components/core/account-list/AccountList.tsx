import React, { Fragment } from 'react';
import { IAttributesCardList } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components/sherpa-ml/bdb-ml-card-list/IAtributesCardList';
import { TransfersBdbMlCardList } from '../../../constants/sherpa-tagged-components';

import styles from './AccountList.module.scss';

interface AccountListProps {
  title: string;
  accounts: string | IAttributesCardList[];
  hiddenArrow?: boolean;
  dataTestId?: string;
  clickItemOption?(e): void;
  clickActionCard?(): void;
  isPrimaryTitle?: boolean;
  eventItemMenu?(e): void;
}

const AccountList = ({
  title,
  accounts,
  hiddenArrow = true,
  dataTestId = 'check-acct-multi-action',
  clickActionCard,
  clickItemOption,
  eventItemMenu,
  isPrimaryTitle = false
}: AccountListProps): JSX.Element => {
  return (
    <Fragment>
      <div className={styles['accounts__content__caption']}>
        <span
          className={`${
            styles[
              isPrimaryTitle
                ? 'accounts__content__caption__title__primary'
                : 'accounts__content__caption__title__second'
            ]
          } sherpa-typography-heading-6`}
        >
          {title}
        </span>
      </div>
      <TransfersBdbMlCardList
        idEl="check-acct-multi-action"
        data-testid={dataTestId}
        valuesCardList={accounts}
        onItemClicked={clickItemOption}
        onActionCardListEmitter={clickActionCard}
        onItemMenuClicked={eventItemMenu}
        hiddenArrow={hiddenArrow}
      />
    </Fragment>
  );
};

export default AccountList;
