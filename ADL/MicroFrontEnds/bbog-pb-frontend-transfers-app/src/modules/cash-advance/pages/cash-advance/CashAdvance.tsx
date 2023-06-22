import React, { lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './CashAdvance.module.scss';
import showNotificationModal from '../../../../notification';
import CashAdvanceEmptyState from '@cash-advance/components/cash-advance-empty-state/CashAdvanceEmptyState';
import CashAdvanceSummary from '@cash-advance/components/cash-advance-summary/CashAdvanceSummary';
import Layout from '@components/core/layout/Layout';
import Version from '@components/core/version/Version';
import { TransfersBdbMlHeaderBv } from '@constants/sherpa-tagged-components';
import { useCashAdvanceWorkFlow } from '@cash-advance/hooks/useCashAdvanceWorkflow.hook';
import { CashAdvanceSteps } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.entity';
import { cashAdvanceWorkflowActions } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.reducer';
import { NotificationControl, NotificationData } from '../../../../notification/Notification';
import { setMainPage } from '@store/shell-events/shell-events.store';
import { useCashAdvanceTransactionCost } from '@cash-advance/hooks/useCashAdvanceTransactionCost.hook';
import { useCashAdvanceNavigation } from '@cash-advance/hooks/useCashAdvanceNavigation.hook';
import { fetchCardsInfo } from '@store/cards-info/cards-info.effect';
import { AppDispatch } from '@store/index';
import { fetchProducts } from '@store/products/products.effect';
import { loadingActions } from '@store/loader/loader.store';
import { makeRequestForBalanceApi } from '@utils/utils';
import { balanceDetail } from '@store/balances/balance.effect';
import { balanceActions } from '@store/balances/balance.reducer';
import { balanceState } from '@store/balances/balance.select';
import { cardsInfoSelector } from '@store/cards-info/cards-info.select';
import { ProductAthTypes } from '@constants/bank-codes';

const CashAdvanceListLazy = lazy(() => import('../cash-advance-list/CashAdvanceList'));

const CashAdvanceAmountLazy = lazy(() => import('../cash-advance-amount/CashAdvanceAmount'));

const CashAdvanceDestinationLazy = lazy(() => import('../cash-advance-destination/CashAdvanceDestination'));

const CashAdvanceConfirmLazy = lazy(() => import('../cash-advance-confirm/CashAdvanceConfirm'));

const CashAdvanceResultLazy = lazy(() => import('../cash-advance-result/CashAdvanceResult'));

const CashAdvance = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

  useCashAdvanceTransactionCost();
  const { onBackClickHandler, rootRedirect } = useCashAdvanceNavigation();
  const { emptyState, step, creditCards, creditCardsCount, directAccess, showGenericError } = useCashAdvanceWorkFlow();

  const [showHeader, setShowHeader] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [errorMessageCalled, setErrorMessageCalled] = useState<boolean>(false);

  const { error: balanceInquiryError, isConsumed: balanceInquiryConsumed } = useSelector(balanceState);
  const { error: cardsInfoError } = useSelector(cardsInfoSelector);

  useEffect(() => {
    !directAccess && dispatch(cashAdvanceWorkflowActions.reset());
    fetchInitData();
    return () => {
      dispatch(cashAdvanceWorkflowActions.reset());
      dispatch(setMainPage(false));
    };
  }, []);

  useEffect(() => {
    setShowHeader(emptyState === 'OK' && step !== CashAdvanceSteps.List);
    setShowSummary(
      emptyState === 'OK' &&
        step !== CashAdvanceSteps.List &&
        step !== CashAdvanceSteps.Confirm &&
        step !== CashAdvanceSteps.Result
    );
    dispatch(setMainPage(emptyState !== 'OK' || step === CashAdvanceSteps.List));
  }, [emptyState, step]);

  useEffect(() => {
    if (creditCardsCount > 0) {
      dispatch(balanceActions.setError(null));
      dispatch(balanceActions.setConsumed(false));
      makeRequestForBalanceApi(creditCards).forEach(balanceRequest => {
        dispatch(
          balanceDetail({ productsInfo: balanceRequest }, [
            ProductAthTypes.CREDIT_CARD_VISA,
            ProductAthTypes.CREDIT_CARD_MASTERCARD
          ])
        ).finally(() => dispatch(balanceActions.setConsumed(true)));
      });
    }
  }, [creditCardsCount]);

  useEffect(() => {
    if (!errorMessageCalled && ((balanceInquiryConsumed && balanceInquiryError) || cardsInfoError)) {
      showGenericError();
      setErrorMessageCalled(true);
    }
  }, [balanceInquiryConsumed, balanceInquiryError, cardsInfoError]);

  const fetchInitData = (): void => {
    dispatch(loadingActions.enable());
    Promise.all([
      dispatch(fetchProducts({ disableLoader: true })),
      dispatch(fetchCardsInfo({ disableLoader: true }))
    ]).finally(() => dispatch(loadingActions.disable()));
  };

  const onForwardBtnClickedHandler = (): void => {
    if (step !== CashAdvanceSteps.Result) {
      openConfirmLeaveDialog();
    } else {
      dispatch(cashAdvanceWorkflowActions.reset());
    }
  };

  const openConfirmLeaveDialog = (): void => {
    const modalData: NotificationData = {
      type: 'warning',
      name: '¿Estas seguro de abandonar la transacción?',
      message: 'Si abandonas perderás el proceso realizado'
    };
    const modalActions: NotificationControl[] = [
      {
        text: 'Si, abandonar',
        action: () => {
          dispatch(cashAdvanceWorkflowActions.reset());
          directAccess && rootRedirect();
        }
      },
      { text: 'No, regresar' }
    ];
    showNotificationModal(modalData, modalActions);
  };

  return (
    <div data-testid="cash-advance-main-container" className={styles['main-container']}>
      {showHeader && (
        <TransfersBdbMlHeaderBv
          data-testid="cash-advance-header"
          leftButtonLabel="Atrás"
          rigthButtonLabel={step !== CashAdvanceSteps.Result ? 'Abandonar' : 'Cerrar'}
          rigthIcon="ico-close"
          titleLabel={step !== CashAdvanceSteps.Result ? 'Avances' : ''}
          hiddenBack={step === CashAdvanceSteps.Result}
          onBackBtnClicked={onBackClickHandler}
          onForwardBtnClicked={onForwardBtnClickedHandler}
        />
      )}
      <div className={styles['main-container__body']}>
        {emptyState !== 'OK' && emptyState !== 'LOADING' ? (
          <CashAdvanceEmptyState />
        ) : (
          <Layout>
            <div className={styles['main-container__body__layout']}>
              <div className={styles['main-container__body__layout__pages']}>
                <Routes>
                  <Route index element={<CashAdvanceListLazy />} />
                  <Route path="/monto-avance" element={<CashAdvanceAmountLazy />} />
                  <Route path="/cuenta-destino" element={<CashAdvanceDestinationLazy />} />
                  <Route path="/resumen" element={<CashAdvanceConfirmLazy />} />
                  <Route path="/resultado-avance" element={<CashAdvanceResultLazy />} />
                </Routes>
              </div>
              <div className={styles['main-container__body__layout__summary']}>
                {showSummary && <CashAdvanceSummary />}
              </div>
            </div>
            <Version backgroundColor="--sherpa-white" />
          </Layout>
        )}
      </div>
    </div>
  );
};

export default CashAdvance;
