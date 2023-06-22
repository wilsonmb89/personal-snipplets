import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import Loader from './components/core/loader/Loader';
import BdbAtToastImpl from './components/sherpa/bdb-at-toast/BdbAtToastImpl';
import { isLoadingSelector } from './store/loader/loader.store';
import { toastStateSelector } from '@store/toast/toast.store';

export default (): JSX.Element => {
  const isLoading = useSelector(isLoadingSelector);
  const { show: showToast, data: toastData } = useSelector(toastStateSelector);

  return (
    <Fragment>
      {isLoading && <Loader />}
      {showToast && <BdbAtToastImpl type={toastData.type} titleToast={toastData.title} messsage={toastData.message} />}
    </Fragment>
  );
};
