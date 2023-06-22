import React, { useLayoutEffect, useRef } from 'react';
import { AuthBdbMlLoader } from '@utils/sherpa-tagged-components';

const Loader = (): JSX.Element => {
  const loaderRef = useRef(null);

  useLayoutEffect(() => {
    if (loaderRef.current.openLoader) {
      loaderRef.current.openLoader();
    }
    return () => {
      if (loaderRef.current.closeLoader) {
        loaderRef.current.closeLoader();
      }
    };
  }, []);

  return <AuthBdbMlLoader ref={loaderRef} />;
};

export default Loader;
