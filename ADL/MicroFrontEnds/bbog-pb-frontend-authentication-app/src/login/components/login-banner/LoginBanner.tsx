import React from 'react';
import styles from './LoginBanner.module.scss';

interface LoginBannerProps {
  imageUrl: string;
  title: string;
  description: string;
}

const LoginBanner = (): JSX.Element => {
  const bannerProps: LoginBannerProps = {
    imageUrl: require('../../../assets/img/banner-image.svg'),
    title: 'Nos estamos renovando con todo lo que necesitas.',
    description: '• Ahora puedes programar tus transferencias.'
  };

  return (
    <div className={styles['banner']} data-testid="login-banner">
      <div className={styles['banner__caption']}>
        <span className="sherpa-typography-heading-6">{bannerProps.title}</span>
        <span className="sherpa-typography-label-1 s-m-t-6">{bannerProps.description}</span>
      </div>
      <div className={styles['banner__image']}>
        <object data={bannerProps.imageUrl} width="218" />
      </div>
    </div>
  );
};

export default LoginBanner;
