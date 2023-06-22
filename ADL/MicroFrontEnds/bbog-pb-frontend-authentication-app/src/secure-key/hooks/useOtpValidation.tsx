import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadingActions } from '@store/loader/loader.store';
import { getCustomer, getFlowData } from '@secure-key/store/customer/customer.store';
import { getOTPApi, otpAuthApi } from '@secure-key/store/otp-auth/otp-auth.api';
import { GetOTPRq, OTPAuthRq } from '@secure-key/store/otp-auth/otp-auth.entity';
import { otpActions } from '@secure-key/store/otp-auth/otp-auth.reducer';
import { fetchProducts } from '@secure-key/store/validation-products/validation-product.effect';
import { notNumberData } from '@secure-key/constants/secure-key-modal-messages';
import { secureKeyPageData } from '@secure-key/constants/secure-key-constants';
import showNotificationModal from '@components/core/modal-notification';

interface UseOtpValidation {
  sendOtpNumber: (sendCall?: boolean) => void;
  notNumber: () => void;
  validateOtp: (otpValue: string) => void;
  resendCode: () => void;
  errorOtp: boolean;
}

export const useOtpValidation = (): UseOtpValidation => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorOtp, setErrorOtp] = useState(false);
  const flowData = useSelector(getFlowData);
  const customer = useSelector(getCustomer);
  const SERVER_ERROR = '500';
  const refType = '01';

  const sendOtpNumber = async (sendCall = false) => {
    dispatch(loadingActions.enable());
    try {
      await getOTPApi(getOtpRequest(sendCall));
      dispatch(loadingActions.disable());
      navigate(flowData.otpValidationPath);
    } catch (error) {
      const { type, name, message } = error;
      showNotificationModal({ type, name, message }, [{ text: 'Entendido' }]);
      dispatch(loadingActions.disable());
    }
  };

  const notNumber = () => {
    showNotificationModal(notNumberData, [{ text: 'Entendido', action: () => navigate('/') }]);
  };

  const validateOtp = async (otpValue: string) => {
    dispatch(loadingActions.enable());
    setErrorOtp(false);
    try {
      const response = await otpAuthApi(getSendOtpRequest(otpValue));
      dispatch(otpActions.setOtpResponse(response));
      Promise.resolve(dispatch(fetchProducts()))
        .then(navigateProductValidation)
        .catch(error => showProductsErrorModal(error));
    } catch (error) {
      if (error.status >= SERVER_ERROR) {
        const { type, name, message } = error;
        showNotificationModal({ type, name, message }, [{ text: 'Entendido', action: () => navigate('/') }]);
      }
      setErrorOtp(true);
      dispatch(loadingActions.disable());
    }
  };

  const resendCode = () => {
    sendOtpNumber(true);
    navigate(flowData.getOtpPath);
  };

  const navigateProductValidation = () => {
    navigate(flowData.productValidationPath);
  };

  const showProductsErrorModal = error => {
    const { type, name, message } = error;
    showNotificationModal({ type, name, message }, [{ text: 'Entendido', action: () => navigate('/') }]);
  };

  const getOtpRequest = (sendCall: boolean): GetOTPRq => {
    const operationType = flowData.flow === secureKeyPageData.register.flow ? 'REG' : 'OLV';
    const name = sendCall ? 'CALL' : 'REG';
    return {
      customer,
      name,
      operationType,
      refType
    };
  };

  const getSendOtpRequest = (otpValue: string): OTPAuthRq => {
    return {
      customer,
      otpValue,
      refType
    };
  };

  return { sendOtpNumber, notNumber, validateOtp, resendCode, errorOtp };
};
