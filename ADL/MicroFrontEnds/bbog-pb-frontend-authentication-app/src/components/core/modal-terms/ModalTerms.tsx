import React, { useLayoutEffect, useRef } from 'react';
import { AuthBdbMlModalTerms } from '@utils/sherpa-tagged-components';
import { termnsTitle, termsAndConditionsContent, termsAndConditionsVersion } from '@utils/termsAndConditions';
import { saveTermsAndConditionsApi } from '@store/user-features/user-features.api';
import { SettingsTermsAndConditions, TermsAndConditionsItem } from '@store/user-features/user-features.entity';

export interface ModalTermsProps {
  loginData: ModalTermsData;
  onSuccess: () => void;
  onError: () => void;
}

export interface ModalTermsData {
  isLoginWeb: boolean;
  windowTop: Window;
  termsAndConditions: TermsAndConditionsItem[];
}

const ModalTerms = ({ loginData, onSuccess, onError }: ModalTermsProps): JSX.Element => {
  const modalRef = useRef(null);

  useLayoutEffect(() => {
    if (modalRef.current.openModal) {
      modalRef.current.openModal();
    }
    return () => {
      if (modalRef.current.closeModal) {
        modalRef.current.closeModal();
      }
    };
  }, []);

  const acceptTermsClicked = () => {
    loginData.termsAndConditions.push({ version: termsAndConditionsVersion, acceptedDate: Date() });
    const tyc: SettingsTermsAndConditions = {
      settings: { termsAndConditions: loginData.termsAndConditions }
    };
    saveTermsAndConditionsApi(tyc).catch(() => {
      onError();
      navigateDashboard();
    });
    onSuccess();
    navigateDashboard();
  };

  const navigateDashboard = () => {
    if (loginData.isLoginWeb && loginData.windowTop) {
      window.top.location.href = `${process.env.DOMAIN}/dashboard`;
    } else {
      window.location.href = `${process.env.DOMAIN}/dashboard`;
    }
  };

  return (
    <AuthBdbMlModalTerms
      data-testid="modal-terms"
      titleterms={termnsTitle}
      ref={modalRef}
      hideClose
      onClickedAcceptTermsBtn={acceptTermsClicked}
    >
      <div slot="body-terms">{termsAndConditionsContent}</div>
    </AuthBdbMlModalTerms>
  );
};

export default ModalTerms;
