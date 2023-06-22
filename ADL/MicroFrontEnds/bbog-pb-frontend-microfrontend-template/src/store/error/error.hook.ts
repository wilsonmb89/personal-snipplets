import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '..';
import { dismissError, errorSelector } from './error.store';

export const useError = (dismissCallback: () => void, errorNames: string[]): void => {
  const dispatch: AppDispatch = useDispatch();

  const fetchError = useSelector(errorSelector);
  const [previousFetchError, setFetchError] = useState(null);
  useEffect(() => {
    if (previousFetchError && !fetchError) {
      setFetchError(null);
      if (errorNames.includes(previousFetchError.name)) {
        dismissCallback();
      }
    }
    setFetchError(fetchError);
  }, [fetchError]);

  useEffect(() => {
    return () => {
      dispatch(dismissError());
    };
  }, []);
};
