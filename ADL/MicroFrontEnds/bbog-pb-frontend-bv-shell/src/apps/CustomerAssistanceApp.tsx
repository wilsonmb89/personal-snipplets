import { mount } from 'customerAssistanceApp/bootstrap';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { routerActions } from '../store/router.store';
import { useNavigate } from 'react-router-dom';

interface CustomerAssistanceAppProps {
  onLogout: () => void;
}

const CustomerAssistanceApp = ({ onLogout }: CustomerAssistanceAppProps): JSX.Element => {
  const ref = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

export default CustomerAssistanceApp;
