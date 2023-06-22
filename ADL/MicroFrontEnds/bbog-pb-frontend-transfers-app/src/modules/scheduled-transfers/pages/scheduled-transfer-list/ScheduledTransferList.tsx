import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchScheduleList } from '../../store/list/scheduled-transfer-list.effect';
import { fetchProducts } from '../../../../store/products/products.effect';
import { fetchAffiliatedAccountsList } from '../../../../store/affiliated-accounts/afilliated-accounts.effect';
import { setScheduledTransferSelected } from '../../store/selected/scheduled-transfer-selected.effect';
import { setTargetAccountByAffiliateId } from '../../store/targetAccount/target-account.effect';
import { loadingActions } from '../../../../store/loader/loader.store';
import { useValidateView } from '../../hooks/useValidateView.hook';

import EmptyState from '../../../../components/core/empty-state/EmptyState';
import styles from './ScheduledTransferList.module.scss';

import { getNavigationPath, ScheduledTranfersPages } from '../../constants/navigation-paths';
import showNotificationModal from '../../../../notification';
import { NotificationData, NotificationControl } from '../../../../notification/Notification';
import { fetchDeleteScheduledTransfer } from '../../store/delete/scheduled-transfer-delete.effect';
import { TransfersBdbMlCardList } from '../../../../constants/sherpa-tagged-components';
import { ACCOUNT_NOT_FOUND_ERROR_MESSAGE, ACCOUNT_NOT_FOUND_ERROR_TITLE } from '../../constants/modals-texts';

const ScheduledTransferList = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getValidView, addScheduledTransferHandler, cardItems } = useValidateView();
  const emptyProperties = getValidView();

  useEffect(() => {
    dispatch(loadingActions.enable());
    const fetchAll = Promise.all([
      dispatch(fetchProducts({ disableLoader: true })),
      dispatch(fetchScheduleList({ disableLoader: true })),
      dispatch(fetchAffiliatedAccountsList({ disableLoader: true }))
    ]);
    fetchAll.then(() => dispatch(loadingActions.disable())).catch(() => dispatch(loadingActions.disable()));
  }, []);

  const redirectToScheduled = ({ detail }): void => {
    dispatch(setScheduledTransferSelected(detail.id));
    const findProductAccount = dispatch(setTargetAccountByAffiliateId(detail.accountToId));
    findProductAccount
      ? navigate(getNavigationPath(ScheduledTranfersPages.SCHEDULED_UPDATE, false))
      : showErrorModal(detail);
  };

  // ToDo: temporary fix while enrolling accounts are deleted
  const showErrorModal = (product: { id: string }): void => {
    const notificationDelete: NotificationData = {
      type: 'error',
      name: ACCOUNT_NOT_FOUND_ERROR_TITLE,
      message: ACCOUNT_NOT_FOUND_ERROR_MESSAGE
    };
    const deleteActions: NotificationControl[] = [
      {
        text: 'Eliminar la programación',
        action: async () => dispatch(fetchDeleteScheduledTransfer(product.id))
      },
      { text: 'Volver', action: () => navigate(getNavigationPath(ScheduledTranfersPages.SCHEDULED_LIST)) }
    ];
    showNotificationModal(notificationDelete, deleteActions);
  };

  return (
    <Fragment>
      <div className={styles['scheduled_transfer']}>
        <div className="col-xs-12 col-sm-10 col-md-10 col-lg-10">
          {emptyProperties && (
            <EmptyState
              buttonDisabled={emptyProperties.buttonDisabled}
              buttonIcon={emptyProperties.buttonIcon}
              buttonText={emptyProperties.buttonText}
              data-testid={emptyProperties.dataTestId}
              descr={emptyProperties.descr}
              descrLink={emptyProperties.descrLink}
              img={emptyProperties.img}
              clickButton={emptyProperties.clickButton}
              clickLink={emptyProperties.clickLink}
            ></EmptyState>
          )}
          {!emptyProperties && (
            <Fragment>
              <div className={`${styles['scheduled_transfer__title']} sherpa-typography-heading-7`}>
                A cuentas bancarias
              </div>
              <TransfersBdbMlCardList
                data-testid="scheduled-transfer-list"
                values-card-list={JSON.stringify(cardItems)}
                onActionCardListEmitter={(event: { detail: { id: string } }): void => redirectToScheduled(event)}
              ></TransfersBdbMlCardList>
            </Fragment>
          )}
        </div>
      </div>
      {!emptyProperties && (
        <div className={styles['scheduled_transfer__add-button']}>
          <button
            id="add-scheduled-transfer-btn"
            data-testid="add-scheduled-transfer-btn"
            className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg--ico"
            onClick={addScheduledTransferHandler}
          >
            <span className="ico-add"></span>
            Nueva programación
          </button>
        </div>
      )}
    </Fragment>
  );
};
export default ScheduledTransferList;
