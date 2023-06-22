import React from 'react';
import styles from './GetOtp.module.scss';
import FormLayout from '@components/core/form-layout/FormLayout';
import { useSelector } from 'react-redux';
import { AuthBdbMlBmOtp } from '@utils/sherpa-tagged-components';
import { useOtpValidation } from '@secure-key/hooks/useOtpValidation';
import { getFlowData, getRegisterBasicData } from '@secure-key/store/customer/customer.store';

const GetOtp = (): JSX.Element => {
  const flowData = useSelector(getFlowData);
  const basicData = useSelector(getRegisterBasicData);
  const { sendOtpNumber, notNumber } = useOtpValidation();

  return (
    <div className={styles['get-otp']} data-testid="get-otp-page">
      <FormLayout title={flowData.title}>
        <div className={styles['get-otp__title']}>
          <span className="sherpa-typography-heading-6">Verifiquemos que eres tú</span>
        </div>
        <div className={styles['get-otp__otp']}>
          <AuthBdbMlBmOtp
            data-testid="get-otp"
            telNumber={basicData.phone}
            onButtonClicked={() => sendOtpNumber()}
            onSecondButtonClicked={notNumber}
          />
        </div>
      </FormLayout>
    </div>
  );
};

export default GetOtp;
