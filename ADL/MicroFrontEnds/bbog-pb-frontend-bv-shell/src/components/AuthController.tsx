import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { authorizationActions, isLoggedInSelector } from '../store/authorization.store';

const loginPaths = [
  '/',
  '/loginweb',
  '/validacion-token',
  '/clave-segura/registro/validacion-cliente',
  '/clave-segura/olvido/validacion-cliente'
];

const AuthController = (): JSX.Element => {
  const isLoggedIn = useSelector(isLoggedInSelector);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = sessionStorage.getItem(btoa('access-token'));

    if ((!accessToken && !loginPaths.includes(location.pathname)) || isLoggedIn === false) {
      sessionStorage.clear();
      navigate('/', { replace: true });
    }

    if (accessToken && loginPaths.includes(location.pathname)) {
      dispatch(authorizationActions.logout());
    }

    if (accessToken && !loginPaths.includes(location.pathname)) {
      dispatch(authorizationActions.login());
    }
  }, [isLoggedIn, location.pathname]);

  return <></>;
};

export default AuthController;
