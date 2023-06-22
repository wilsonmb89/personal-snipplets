import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { useValidateView } from '../../hooks/useValidateView.hook';
import { getNavigationPath, BetweenAccountPages } from '../../constants/navigation-paths';

import Layout from '../../../../components/core/layout/Layout';

import { TransfersBdbAtAlert } from '../../../../constants/sherpa-tagged-components';
import EmptyState from '../../../../components/core/empty-state/EmptyState';
import AccountList from '../../../../components/core/account-list/AccountList';
import { useDeleteAccount } from '../../hooks/useDeleteAccount.hook';

import styles from './BetweenAccountsList.module.scss';

const TITLE_PRIMARY = 'Cuentas propias';

const TITLE_SECUNDARY = 'Cuentas inscritas';

const BetweenAccountsList = (): JSX.Element => {
  const navigate = useNavigate();

  const {
    affiliatedAccts,
    ownAccounts,
    firstLoad,
    getValidView,
    saveAccountSelected,
    scheduledTransfersRedirect,
    enrollAccountRedirect
  } = useValidateView();

  const { deleteAccount } = useDeleteAccount();

  const retryOwnAccounts = getValidView('retryOwnAccounts');

  const retryAffiliatedAccounts = getValidView('retryAffiliatedAccounts');

  const emptyState = getValidView('emptyState');

  const redirectToScheduledTransfers = (event: CustomEvent): void => {
    switch (event.detail.value) {
      case '0':
        navigate(getNavigationPath(BetweenAccountPages.TRANSFER_TO_ACCOUNT_AMOUNT));
        break;
      case '1':
        scheduledTransfersRedirect();
        break;
      default:
        deleteAccount();
        break;
    }
  };

  const titleComponent = (title: string) => {
    return (
      <div className={styles['st-accounts__content__caption']}>
        <span className={`${styles['st-accounts__content__caption__title']} sherpa-typography-heading-6`}>{title}</span>
      </div>
    );
  };

  const saveAccount = (event: CustomEvent): void => {
    const { value, avatar, icon, desc2, desc, title, productType, bankId } = event.detail;
    if (ownAccounts.length === 1 && icon) return;
    saveAccountSelected({
      avatar,
      description: desc2,
      productNumber: value,
      icon,
      productBankName: desc,
      title,
      productType,
      bankId
    });
    navigate(getNavigationPath(BetweenAccountPages.TRANSFER_TO_ACCOUNT_AMOUNT));
  };

  const saveAccountFromOption = (event: CustomEvent) => {
    const { value, avatar, icon, desc2, desc, title, productType, bankId } = event.detail.card;
    saveAccountSelected({
      avatar,
      description: desc2,
      productNumber: value,
      icon,
      productBankName: desc,
      title,
      productType,
      bankId
    });
  };

  return (
    <Fragment>
      {!firstLoad && (
        <div className={`${styles['between_accounts']} col-xs-12 col-sm-10 col-md-10 col-lg-10`}>
          {emptyState ? (
            <EmptyState
              img={emptyState.img}
              descr={emptyState.descr}
              buttonText={emptyState.buttonText}
              buttonIcon={emptyState.buttonIcon}
              clickButton={emptyState.clickButton}
            />
          ) : (
            <div className={styles['st-accounts']}>
              <Layout slot="content">
                {retryOwnAccounts ? (
                  <Fragment>
                    {titleComponent(TITLE_PRIMARY)}
                    <TransfersBdbAtAlert
                      type="WARNING"
                      onButtonClickedEvent={retryOwnAccounts.clickButton}
                      description="Tus cuentas propias no se pudieron cargar."
                      button-text="Volver a cargar"
                      data-testid={retryOwnAccounts.dataTestId}
                      close-button={false}
                    />
                  </Fragment>
                ) : (
                  <AccountList
                    title={TITLE_PRIMARY}
                    hiddenArrow={ownAccounts.length === 1}
                    isPrimaryTitle
                    accounts={ownAccounts}
                    clickActionCard={saveAccount.bind(this)}
                    clickItemOption={redirectToScheduledTransfers}
                    eventItemMenu={saveAccountFromOption.bind(this)}
                  />
                )}
                {retryAffiliatedAccounts ? (
                  <Fragment>
                    {titleComponent(TITLE_SECUNDARY)}
                    <TransfersBdbAtAlert
                      type="WARNING"
                      onButtonClickedEvent={retryAffiliatedAccounts.clickButton}
                      description="Tus cuentas inscritas no se pudieron cargar."
                      button-text="Volver a cargar"
                      data-testid={retryAffiliatedAccounts.dataTestId}
                      close-button={false}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    {affiliatedAccts && affiliatedAccts.length > 0 && (
                      <AccountList
                        title={TITLE_SECUNDARY}
                        hiddenArrow={false}
                        dataTestId="affiliated-accounts"
                        isPrimaryTitle
                        accounts={affiliatedAccts}
                        clickActionCard={saveAccount.bind(this)}
                        clickItemOption={redirectToScheduledTransfers}
                        eventItemMenu={saveAccountFromOption.bind(this)}
                      />
                    )}
                  </Fragment>
                )}
              </Layout>
            </div>
          )}
        </div>
      )}
      <div className={`${styles['between_accounts__version']} sherpa-typography-caption-1`}>v.1.1.1</div>
      {(!retryOwnAccounts || !retryAffiliatedAccounts) && !emptyState && !firstLoad && (
        <div className={styles['between_accounts__add-button']}>
          <button
            id="add-scheduled-transfer-btn"
            data-testid="add-scheduled-transfer-btn"
            className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg--ico"
            onClick={() => enrollAccountRedirect()}
          >
            Inscribir cuenta
          </button>
        </div>
      )}
    </Fragment>
  );
};

export default BetweenAccountsList;
