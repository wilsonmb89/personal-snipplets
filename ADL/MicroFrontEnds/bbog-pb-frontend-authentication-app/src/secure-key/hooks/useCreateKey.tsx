import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { otpActions } from '@secure-key/store/otp-auth/otp-auth.reducer';
import { customerActions } from '@secure-key/store/customer/customer.store';
import { validationProductsActions } from '@secure-key/store/validation-products/validation-products.reducer';
import { newKeyCreatedModal } from '@secure-key/constants/secure-key-modal-messages';
import { CreateKeyForm } from '@secure-key/pages/create-key/CreateKey';
import { createKey } from '@secure-key/store/set-secure-key/set-secure-key.effect';
import showNotificationModal from '@components/core/modal-notification';

interface UseCreateKey {
  createNewKey: (values: CreateKeyForm) => void;
}

export const useCreateKey = (): UseCreateKey => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createNewKey = async (values: CreateKeyForm) => {
    Promise.resolve(dispatch(createKey(values.confirmationKey)))
      .then(showSuccessModal)
      .catch(error => showErrorModal(error));
  };

  const showSuccessModal = () => {
    clearStorage();
    showNotificationModal(newKeyCreatedModal, [{ text: 'Entendido', action: () => navigate('/') }]);
  };

  const showErrorModal = error => {
    const { type, name, message } = error;
    showNotificationModal({ type, name, message }, [{ text: 'Entendido' }]);
  };

  const clearStorage = () => {
    dispatch(customerActions.reset());
    dispatch(otpActions.reset());
    dispatch(validationProductsActions.reset());
  };

  return { createNewKey };
};
