import { mount } from 'legacyApp/bootstrap';
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { routerActions, routeSelector } from '../store/router.store';
import { authorizationActions } from '../store/authorization.store';
import { useLocation, useNavigate } from 'react-router-dom';

const prefix = process.env.TAG === 'LOCAL' ? '/bbog-pb-frontend-legacy-web/' : '';

const LegacyApp = (): JSX.Element => {
  const ref = useRef(null);
  const route = useSelector(routeSelector);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [microfrontend, setMicrofrontend] = useState(null);

  const routesMicroFrontends = [
    '/transferencias/programadas',
    '/transferencias/avances'
  ];

  useEffect(() => {
    dispatch(routerActions.showLoader());

    const iframeHash = `${prefix}#/master/dash`;

    const checkMicrontendRoute = (pathName: string): boolean => {
      for (let x = 0; x <= routesMicroFrontends.length; x++ ) {
        const pattern = new RegExp('^' + routesMicroFrontends[x]);
        if (pattern.test(pathName)) {
          return true;
        }
      }
      return false;
    };

    if (checkMicrontendRoute(location.pathname)) {
      navigate('/dashboard');
    }

    const microfrontendPromise = mount(ref.current, {
      lastUrl: iframeHash,
      event: (type, data) => {
        switch (type) {
          case 'NAVIGATION':
            navigate(data.route);
            break;
          case 'LOGIN':
            dispatch(authorizationActions.login());
            break;
          case 'LOGOUT':
            dispatch(authorizationActions.logout());
            break;
          case 'START':
            dispatch(routerActions.hideLoader());
            break;
          default:
            console.error(`unexpected event ${type}`);
        }
      }
    });

    microfrontendPromise.then(microfrontend => {
      setMicrofrontend(microfrontend);
    });

    return () => {
      if (microfrontend) {
        microfrontend.unmount();
      }
    };
  }, []);

  useEffect(() => {
    if (microfrontend && route) {
      microfrontend.navigate(route);
      dispatch(routerActions.route(null));
    }
  }, [route]);

  return <div ref={ref} className="shell-container__legacy" />;
};

export default LegacyApp;
