import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { externalNavigate, externalRouteSelector } from './shell-events.store';

export const useShellEvents = (navigate: (route: string | number) => void): void => {
  const dispatch = useDispatch();
  const externalRoute = useSelector(externalRouteSelector);

  useEffect(() => {
    if (externalRoute) {
      navigate(externalRoute);
      dispatch(externalNavigate(null));
    }
  }, [navigate, externalRoute]);
};
