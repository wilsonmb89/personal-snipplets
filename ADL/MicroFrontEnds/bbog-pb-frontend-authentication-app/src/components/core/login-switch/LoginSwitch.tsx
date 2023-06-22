import React, { lazy } from 'react';
import { useLocation } from 'react-router-dom';

const Login = lazy(() => import('@login/pages/login/Login'));
const LoginPortal = lazy(() => import('@login/pages/login-web/LoginWeb'));

const LoginSwitch = (): JSX.Element => {
  const location = useLocation();
  return <>{location.hash === '#/loginweb' ? <LoginPortal /> : <Login />}</>;
};

export default LoginSwitch;
