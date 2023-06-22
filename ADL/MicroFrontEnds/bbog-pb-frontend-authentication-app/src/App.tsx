import React, { Fragment, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { isLoadingSelector } from '@store/loader/loader.store';
import { useShellEvents } from '@store/shell-events/shell-events.hook';
import Loader from '@components/core/loader/Loader';
import LoginSwitch from '@components/core/login-switch/LoginSwitch';
import PrivateRouteSecureKey from '@components/private-route-secure-key/PrivateRouteSecureKey';

export const LoginPortal = lazy(() => import('./login/pages/login-web/LoginWeb'));
export const TokenLogin = lazy(() => import('./login/pages/token-validation/TokenValidation'));

export const UserValidation = lazy(() => import('./secure-key/pages/user-validation/UserValidation'));
export const ProductValidation = lazy(() => import('./secure-key/pages/product-validation/ProductValidation'));
export const CreateKey = lazy(() => import('./secure-key/pages/create-key/CreateKey'));
export const GetOtp = lazy(() => import('./secure-key/pages/otp-validation/get-otp/GetOtp'));
export const OtpValidation = lazy(() => import('./secure-key/pages/otp-validation/otp-auth/OtpAuth'));

export interface AppProps {
  navigate: (route: string | number) => void;
}

export default ({ navigate }: AppProps): JSX.Element => {
  const isLoading = useSelector(isLoadingSelector);
  useShellEvents(navigate);

  return (
    <Fragment>
      <BrowserRouter basename="/">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/">
              <Route index element={<LoginSwitch />} />
            </Route>
            <Route path="loginweb" element={<LoginPortal />} />
            <Route path="validacion-token" element={<TokenLogin />} />

            <Route path="clave-segura/:type">
              <Route path="validacion-cliente" element={<UserValidation />} />
              <Route
                path="envio-otp"
                element={
                  <PrivateRouteSecureKey>
                    <GetOtp />
                  </PrivateRouteSecureKey>
                }
              />
              <Route
                path="validacion-otp"
                element={
                  <PrivateRouteSecureKey>
                    <OtpValidation />
                  </PrivateRouteSecureKey>
                }
              />
              <Route
                path="validacion-producto"
                element={
                  <PrivateRouteSecureKey>
                    <ProductValidation />
                  </PrivateRouteSecureKey>
                }
              />
              <Route
                path="crear"
                element={
                  <PrivateRouteSecureKey>
                    <CreateKey />
                  </PrivateRouteSecureKey>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      {isLoading && <Loader />}
    </Fragment>
  );
};
