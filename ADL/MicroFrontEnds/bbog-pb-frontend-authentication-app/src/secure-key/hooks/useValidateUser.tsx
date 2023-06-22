import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '@store/index';
import { loadingActions } from '@store/loader/loader.store';
import { UserValidationForm } from '@secure-key/pages/user-validation/UserValidation';
import { customerActions, getFlowData } from '@secure-key/store/customer/customer.store';
import { userValidationError } from '@secure-key/constants/secure-key-modal-messages';
import { Customer, RegisterBasicData } from '@secure-key/store/customer/customer.entity';
import { registerBasicDataApi } from '@secure-key/store/customer/customer-api';
import showNotificationModal from '@components/core/modal-notification';

interface UseValidateUser {
  validateUser: (data: UserValidationForm) => void;
}

export const useValidateUser = (): UseValidateUser => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const flowData = useSelector(getFlowData);

  const validateUser = async (data: UserValidationForm) => {
    dispatch(loadingActions.enable());
    try {
      const customer = getCustomer(data);
      const response = await registerBasicDataApi(customer);
      dispatch(customerActions.setCustomer(customer));
      dispatch(customerActions.setBasicData(response));
      validateData(response);
    } catch (error) {
      showErrorModal(error);
    }
  };

  const validateData = (data: RegisterBasicData) => {
    dispatch(loadingActions.disable());
    if (data.isCustomer && !data.phone) {
      showNotificationModal(userValidationError.withoutSecureData, [
        { text: 'Entendido', action: () => navigate('/') }
      ]);
    } else if (data.isCustomer && !data.hasProducts) {
      showNotificationModal(userValidationError.noActiveProducts, [{ text: 'Entendido', action: () => navigate('/') }]);
    } else if (data.isCustomer && !data.hasSecureKey) {
      registerValidate();
    } else if (data.isCustomer && data.hasSecureKey) {
      forgetValidate();
    } else {
      showNotificationModal(userValidationError.notCustomer, [{ text: 'Entendido' }]);
    }
  };

  const registerValidate = () => {
    if (flowData.flow === 'register') {
      navigate(flowData.getOtpPath);
    } else {
      showNotificationModal(userValidationError.withoutSecureKey, [{ text: 'Entendido', action: () => navigate('/') }]);
    }
  };

  const forgetValidate = () => {
    if (flowData.flow === 'forget') {
      navigate(flowData.getOtpPath);
    } else {
      showNotificationModal(userValidationError.hasSecureKey, [{ text: 'Entendido', action: () => navigate('/') }]);
    }
  };

  const showErrorModal = error => {
    dispatch(loadingActions.disable());
    const { type, name, message } = error;
    showNotificationModal({ type, name, message }, [{ text: 'Entendido' }]);
  };

  const getCustomer = (data: UserValidationForm): Customer => {
    return {
      identificationType: data.documentType,
      identificationNumber: data.documentNumber,
      remoteAddress: '127.0.0.1',
      channel: 'PB',
      terminalId: 'IN01'
    };
  };

  return { validateUser };
};
