import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loader from './components/loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { isLoadingSelector } from './store/router.store';
import { authorizationActions, isLoggedInSelector } from './store/authorization.store';
import LegacyApp from './apps/LegacyApp';
import Version from './components/version/Version';
import ErrorBoundary from './components/error-boundary/ErrorBoundary';
import AuthController from './components/AuthController';

const SettingsAppLazy = lazy(() => import('./apps/SettingsApp'));
const CustomerAssistanceAppLazy = lazy(() => import('./apps/CustomerAssistanceApp'));
const AuthenticationAppLazy = lazy(() => import('./apps/AuthenticationApp'));
const TransfersAppLazy = lazy(() => import('./apps/TransfersApp'));
const BetweenAccountLazy = lazy(() => import('./apps/TransfersApp'));
const CashAdvanceLazy = lazy(() => import('./apps/TransfersApp'));

const App = (): JSX.Element => {
  const isLoading = useSelector(isLoadingSelector);
  const isLoggedIn = useSelector(isLoggedInSelector);
  const isDevelopment = ['LOCAL', 'DEV', 'STG'].includes(process.env.TAG);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authorizationActions.logout());
  };

  return (
    <div className="shell-container">
      <BrowserRouter>
        <AuthController />
        {(isLoggedIn || !isDevelopment) && <LegacyApp />}
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="settings">
              <Route
                path="*"
                element={
                  <ErrorBoundary>
                    <SettingsAppLazy onLogout={handleLogout} />
                  </ErrorBoundary>
                }
              />
            </Route>
            <Route
              path="ayuda"
              element={
                <ErrorBoundary>
                  <CustomerAssistanceAppLazy onLogout={handleLogout} />
                </ErrorBoundary>
              }
            />
            <Route path="transferencias">
              {/** TODO: One time that all Micro frontends be developed uncomment line 35 and all lines
               * below will be delete only will stay line 35
               */}
              {/**<Route path="*" element={<TransfersAppLazy onLogout={handleLogout} />} />**/}
              <Route path="programadas">
                <Route
                  index
                  element={
                    <ErrorBoundary>
                      <TransfersAppLazy onLogout={handleLogout} />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="*"
                  element={
                    <ErrorBoundary>
                      <TransfersAppLazy onLogout={handleLogout} />
                    </ErrorBoundary>
                  }
                />
              </Route>
              <Route
                path="entre-cuentas"
                element={
                  <ErrorBoundary>
                    <BetweenAccountLazy onLogout={handleLogout} />
                  </ErrorBoundary>
                }
              />
              <Route
                path="avances"
                element={
                  <ErrorBoundary>
                    <CashAdvanceLazy onLogout={handleLogout} />
                  </ErrorBoundary>
                }
              >
                <Route
                  path="*"
                  element={
                    <ErrorBoundary>
                      <CashAdvanceLazy onLogout={handleLogout} />
                    </ErrorBoundary>
                  }
                />
              </Route>
            </Route>
            <Route path="/" element={<ErrorBoundary><AuthenticationAppLazy onLogout={handleLogout} /></ErrorBoundary>} />
            <Route path="loginweb" element={<ErrorBoundary><AuthenticationAppLazy onLogout={handleLogout} /></ErrorBoundary>} />
            <Route path="validacion-token" element={<ErrorBoundary><AuthenticationAppLazy onLogout={handleLogout} /></ErrorBoundary>} />
            <Route path="clave-segura/:type/validacion-cliente" element={<ErrorBoundary><AuthenticationAppLazy onLogout={handleLogout} /></ErrorBoundary>} />
            <Route path="dashboard"/>
          </Routes>
        </Suspense>
      </BrowserRouter>
      {isLoading && <Loader />}
      <ErrorBoundary>
        <Version />
      </ErrorBoundary>
    </div>
  );
};

export default App;
