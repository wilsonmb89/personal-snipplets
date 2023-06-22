import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../../../store/products/products.effect';
import { fetchUserFeatures } from '../../../../store/user-features/user-features.effect';
import Layout from '../../../../components/core/layout/Layout';
import TargetAccountHeader from '../../components/target-account-header/TargetAccountHeader';
import ScheduledTransferForm from '../../components/scheduled-transfer-form/ScheduledTransferForm';
import styles from './ScheduledTransferCreate.module.scss';
import { targetAccountActions } from '../../store/targetAccount/target-account.reducer';
import { externalNavigate } from '../../../../store/shell-events/shell-events.store';
import { getNavigationPath, NAVIGATION_PATHS, ScheduledTranfersPages } from '../../constants/navigation-paths';
import { NotificationControl, NotificationData } from '../../../../notification/Notification';
import showNotificationModal from '../../../../notification';
import { TransfersBdbMlHeaderBv } from '../../../../constants/sherpa-tagged-components';

const TITLE_PAGE = 'Programación a cuenta';
const SUBTITLE_PAGE = 'Completa la información para realizar la programación.';

const useQuery = () => new URLSearchParams(useLocation().search);

const ScheduledTransferCreate = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isUpdate = location.pathname === NAVIGATION_PATHS.UPDATE;
  const query = useQuery();

  useEffect(() => {
    dispatch(fetchProducts({ disableLoader: true }));
    dispatch(fetchUserFeatures());
  }, []);

  const onErrorHandler = (): void => {
    const notificationDelete: NotificationData = {
      type: 'error',
      name: 'Algo ha fallado',
      message: 'En estos momentos no podemos realizar la operación. Por favor inténtalo nuevamente más tarde.'
    };
    const deleteActions: NotificationControl[] = [{ text: 'Entendido', action: () => goBackHandler() }];
    showNotificationModal(notificationDelete, deleteActions);
  };

  const goBackHandler = (): void => {
    const internal = query.get('internal');
    if (internal) {
      dispatch(targetAccountActions.reset());
      navigate(
        getNavigationPath(
          isUpdate ? ScheduledTranfersPages.SCHEDULED_LIST : ScheduledTranfersPages.SCHEDULED_ACCT_CHECK,
          false
        )
      );
    } else {
      dispatch(externalNavigate(-1));
    }
  };

  const confirmGoOut = (isBack: boolean) => {
    const notificationGoOut: NotificationData = {
      type: 'warning',
      name: '¿Estas seguro de abandonar la programación?',
      message: 'Si abandonas perderás el proceso realizado'
    };
    const deleteActions: NotificationControl[] = [
      { text: 'Sí, abandonar', action: () => (isBack ? goBackHandler() : dispatch(externalNavigate(-1))) },
      { text: 'No, regresar' }
    ];
    showNotificationModal(notificationGoOut, deleteActions);
  };

  return (
    <div className={styles['st-create']}>
      <TransfersBdbMlHeaderBv
        data-testid="header"
        leftButtonLabel="Atrás"
        rigthButtonLabel="Cerrar"
        rigthIcon="ico-close"
        titleLabel="Programar transferencias"
        onBackBtnClicked={() => confirmGoOut(true)}
        onForwardBtnClicked={() => confirmGoOut(false)}
      ></TransfersBdbMlHeaderBv>

      <div className={styles['st-create__content']} data-testid="scheduled-create-page">
        <Layout slot="content">
          <div className={styles['st-create__content__caption']}>
            <span className={`${styles['st-create__content__caption__title']} sherpa-typography-heading-6`}>
              {TITLE_PAGE}
            </span>
            <span className={`${styles['st-create__content__caption__subtitle']} sherpa-typography-body-2`}>
              {SUBTITLE_PAGE}
            </span>
          </div>

          <div className={styles['st-create__content__form']}>
            <div className="col-xs-12 col-sm-10 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
              <TargetAccountHeader />
              <ScheduledTransferForm isUpdate={isUpdate} onError={onErrorHandler} />
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default ScheduledTransferCreate;
