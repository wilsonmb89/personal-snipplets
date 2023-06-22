import { mount } from 'transfersApp/bootstrap';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { routerActions } from '../store/router.store';
import { useNavigate } from 'react-router-dom';

interface TransfersApp {
  onLogout: () => void;
}

const TransfersApp = ({ onLogout }: TransfersApp): JSX.Element => {
  const ref = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const microfrontendPromise = mount(ref.current, route => {
      if (route === '/logout') {
        return onLogout();
      } else if (typeof route === 'string' && route.includes('/legacy')) {
        const path = route.replace('/legacy', '');
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

  return React.createElement('div', { className: 'shell-container__mf shell-container__portal', ref: ref });
};

export default TransfersApp;
