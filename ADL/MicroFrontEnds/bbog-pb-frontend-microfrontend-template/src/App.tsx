import React, { Fragment, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loader from './components/core/loader/Loader';
import ModalError from './components/core/modal-error/ModalError';
import BdbAtToastImpl from './components/sherpa/bdb-at-toast/BdbAtToastImpl';
import { AppDispatch } from '@store/index';
import { isLoadingSelector } from '@store/loader/loader.store';
import { dismissError, errorSelector } from '@store/error/error.store';
import { toastSelector } from '@store/toast/toast.store';
import { fetchProducts } from '@store/products/products.effect';
import { productsSelector } from '@store/products/products.select';

// Delete this component, it was build for scaffolding testing
const TemporalElement = ({ navigate }): JSX.Element => {
  const products = useSelector(productsSelector);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  return (
    <div>
      <h1>Microfrontend is running!</h1>
      <button onClick={() => navigate('/')}>Navigation</button>
      <ul>
        {products.map(product => (
          <li key={product.productNumber}>{product.description}</li>
        ))}
      </ul>
    </div>
  );
};
export interface AppProps {
  navigate: (route: string | number) => void;
}

export default ({ navigate }: AppProps): JSX.Element => {
  const isLoading = useSelector(isLoadingSelector);
  const error = useSelector(errorSelector);
  const { text, type } = useSelector(toastSelector);
  const dispatch: AppDispatch = useDispatch();

  return (
    <Fragment>
      <BrowserRouter basename="microfrontend">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/">
              <Route index element={<TemporalElement navigate={navigate} />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      {isLoading && <Loader />}
      {!!error && <ModalError onClose={() => dispatch(dismissError())} error={error} />}
      {!!text && <BdbAtToastImpl messsage={text} type={type.toUpperCase()} />}
    </Fragment>
  );
};
