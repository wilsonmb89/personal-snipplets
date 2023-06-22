import { mount } from 'settingsApp/bootstrap';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { routerActions } from '../store/router.store';
import { useNavigate } from 'react-router-dom';

interface SettingsAppProps {
  onLogout: () => void;
}

const SettingsApp = ({ onLogout }: SettingsAppProps): JSX.Element => {
  const ref = useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const microfrontendPromise = mount(ref.current, route => {
      if (route === '/logout') {
        return onLogout();
      } else if (route.includes('/legacy')) {
        const path = route.replace('/legacy', '');
        navigate('/dashboard');
        return dispatch(routerActions.route(path));
      }
      navigate(route);
    });
    return () => {
      microfrontendPromise.then(microfrontend => {
        microfrontend.unmount();
      });
    };
  }, []);

  return <div ref={ref} className="shell-container__mf" />;
};

export default SettingsApp;
