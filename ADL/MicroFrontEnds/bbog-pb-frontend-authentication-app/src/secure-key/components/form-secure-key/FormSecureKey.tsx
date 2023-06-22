import React from 'react';
import styles from './FormSecureKey.module.scss';

interface LayoutProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  slot?: string;
}

const FormSecureKey = ({ title, description, children }: LayoutProps): JSX.Element => {
  return (
    <div slot="formSecure" className={styles['form']}>
      <div className={styles['form__icon']}>
        <span className="ico-password-lock"></span>
      </div>
      <div className={`${styles['form__title']} sherpa-typography-heading-6`}>{title}</div>
      <div className={`${styles['form__description']} sherpa-typography-body-1`}>{description}</div>
      <div className={styles['form__inputs']}>{children}</div>
    </div>
  );
};

export default FormSecureKey;
