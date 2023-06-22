import React, { Fragment, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Loader from './components/core/loader/Loader';
import ModalError from './components/core/modal-error/ModalError';
import PulseToast from './components/pulse/pulse-toast/PulseToast';
import { dismissError, errorSelector } from './store/error/error.store';
import { isLoadingSelector } from './store/loader/loader.store';
import { dismissToast, toastTextSelector } from './store/toast/toast.store';

const AccountsLazy = lazy(() => import('./limits/pages/accounts/Accounts'));
const LimitsFormLazy = lazy(() => import('./limits/pages/limits-form/LimitsForm'));

export interface AppProps {
  navigate: (route: string) => void;
}

export default ({ navigate }: AppProps): JSX.Element => {
  const isLoading = useSelector(isLoadingSelector);
  const error = useSelector(errorSelector);
  const textToast = useSelector(toastTextSelector);

  const dispatch = useDispatch();

  return (
    <Fragment>
      <BrowserRouter basename="/settings">
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path="/limits-form">
              <LimitsFormLazy navigate={navigate} />
            </Route>
            <Route path="/accounts">
              <AccountsLazy navigate={navigate} />
            </Route>
            <Route path="/">
              <Redirect to="/accounts" />
            </Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
      {isLoading && <Loader />}
      {!!error && <ModalError onClose={() => dispatch(dismissError())} error={error} />}
      {!!textToast && <PulseToast text={textToast} onClose={() => dispatch(dismissToast())} />}
    </Fragment>
  );
};
