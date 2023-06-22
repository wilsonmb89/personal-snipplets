import { Navigate } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { getCustomer } from '@secure-key/store/customer/customer.store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRouteSecureKey = ({ children }: PrivateRouteProps): JSX.Element => {
  const customer = useSelector(getCustomer);
  const isLoggedIn = customer.identificationNumber && customer.identificationType;

  return isLoggedIn ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRouteSecureKey;
