import { mount } from 'authenticationApp/bootstrap';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { routerActions } from '../store/router.store';
import { useNavigate } from 'react-router-dom';
import { authorizationActions } from '../store/authorization.store';

interface AuthenticationAppProps {
  onLogout: () => void;
}

const AuthenticationApp = ({ onLogout }: AuthenticationAppProps): JSX.Element => {
  const ref = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const microfrontendPromise = mount(ref.current, route => {
      if (route === '/login') {
        dispatch(authorizationActions.login());
        return navigate('/dashboard');
      } else if (route === '/logout') {
        return onLogout();
      } else if (typeof route === 'string' && route.includes('/legacy')) {
        const path = route.replace('/legacy', '');
        navigate('/dashboard');
        return dispatch(routerActions.route(path));
      }
      navigate(route as unknown);
    });
    return () => {
      microfrontendPromise.then(microfrontend => {
        microfrontend.unmount();
      });
    };
  }, []);

  return <div ref={ref} className="shell-container__mf shell-container__auth" />;
};

export default AuthenticationApp;
