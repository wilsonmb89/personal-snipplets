import React, { Fragment, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppDispatch } from './store';
import { isLoadingSelector } from './store/loader/loader.store';
import { actionSelector, dismissError, errorSelector } from './store/error/error.store';
import { toastSelector } from './store/toast/toast.store';
import Loader from './components/core/loader/Loader';
import ModalError from './components/core/modal-error/ModalError';
import BdbAtToastImpl from './components/sherpa/bdb-at-toast/BdbAtToastImpl';
import LayoutWrapper from './components/core/layout-wrapper/LayoutWrapper';
import { useShellEvents } from './store/shell-events/useShellEvents.hook';
import { globalFunctions } from './global-functions';

export const ScheduledTransferCreateLazy = lazy(
  () => import('./modules/scheduled-transfers/pages/scheduled-transfer-create/ScheduledTransferCreate')
);
export const ScheduledTransferListLazy = lazy(
  () => import('./modules/scheduled-transfers/pages/scheduled-transfer-list/ScheduledTransferList')
);
export const ScheduledTransferAcctCheck = lazy(
  () => import('./modules/scheduled-transfers/pages/scheduled-transfer-acct-check/ScheduledTransferAcctCheck')
);
export const BetweenAccountListLazy = lazy(
  () => import('./modules/between-accounts/pages/between-accounts-list/BetweenAccountsList')
);
export const EnrollAccountLazy = lazy(() => import('./modules/between-accounts/pages/enroll-account/EnrollAccount'));
export const TransferAccountLazy = lazy(
  () => import('./modules/between-accounts/pages/transfer-account/TransferAccount')
);
const CashAdvanceLazy = lazy(() => import('./modules/cash-advance/pages/cash-advance/CashAdvance'));
export interface AppProps {
  navigate: (route: string | number) => void;
}

export default ({ navigate }: AppProps): JSX.Element => {
  const isLoading = useSelector(isLoadingSelector);
  const error = useSelector(errorSelector);
  const actionText = useSelector(actionSelector);
  const { title, text, description, type, textLink } = useSelector(toastSelector);
  const { toastFn } = globalFunctions;
  const dispatch: AppDispatch = useDispatch();
  useShellEvents(navigate);

  const modalErrorCloseHandler = () => {
    dispatch(dismissError());
  };

  return (
    <Fragment>
      <BrowserRouter basename="transferencias">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<LayoutWrapper />}>
              <Route path="programadas">
                <Route index element={<ScheduledTransferListLazy />} />
                <Route path="crear" element={<ScheduledTransferCreateLazy />} />
                <Route path="editar" element={<ScheduledTransferCreateLazy />} />
                <Route path="seleccionar-cuenta" element={<ScheduledTransferAcctCheck />} />
              </Route>
              <Route path="entre-cuentas">
                <Route index element={<BetweenAccountListLazy />} />
                <Route path="inscribir-cuenta">
                  <Route path="cuenta-destino" element={<EnrollAccountLazy />} />
                  <Route path="titular" element={<EnrollAccountLazy />} />
                </Route>
                <Route path="transferir">
                  <Route path="ingresar-monto" element={<TransferAccountLazy />} />
                  <Route path="seleccionar-cuenta" element={<TransferAccountLazy />} />
                  <Route path="resultado-transferencia" element={<TransferAccountLazy />} />
                </Route>
              </Route>
              <Route path="avances/*" element={<CashAdvanceLazy />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      {isLoading && <Loader />}
      {!!error && (
        <ModalError
          callToAction={modalErrorCloseHandler}
          onClose={modalErrorCloseHandler}
          error={error}
          primaryActionText={actionText}
        />
      )}
      {(text || description) && (
        <BdbAtToastImpl
          titleToast={title}
          textDesc={description}
          type={type}
          message={text}
          textLink={textLink}
          onLinkClick={toastFn}
        />
      )}
    </Fragment>
  );
};
