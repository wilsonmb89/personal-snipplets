import React, { useState } from 'react';
import styles from './Login.module.scss';
import { AuthBdbAtLogo, AuthBdbMlHorizontalSelector } from '@utils/sherpa-tagged-components';
import { titles, carouselOptions, version, products } from '@login/constants/login-page-constants';
import { NotificationData } from '@components/core/modal-notification/ModalNotification';
import LoginBanner from '@login/components/login-banner/LoginBanner';
import LoginForm from '@login/components/login-form/LoginForm';
import Layout from '@components/core/layout/Layout';
import showNotificationModal from '@components/core/modal-notification';
import ModalProducts from '@components/core/modal-products/ModalProducts';

const Login = (): JSX.Element => {
  const [showModalProducts, setShowModalProducts] = useState(false);

  const productSelection = product => {
    switch (product.type) {
      case 'link': {
        window.open(product.value);
        break;
      }
      case 'call': {
        const servilineaModal: NotificationData = {
          type: 'information',
          name: 'Líneas de Atención',
          message: product.value.map(contact => (
            <div className={styles['contact-numbers']} key={contact.city}>
              <span>{contact.city}:</span>
              <span>{contact.phone}</span>
            </div>
          ))
        };
        showNotificationModal(servilineaModal, [{ text: 'Entendido' }]);
        break;
      }
      case 'products': {
        setShowModalProducts(true);
        break;
      }
    }
  };

  return (
    <div className={styles['login']}>
      <Layout>
        <div className={`${styles['login__form']} col-xs-12 col-sm-10 col-lg-4 col-sm-offset-1 col-lg-offset-1`}>
          <div className={styles['login__form__head']}>
            <AuthBdbAtLogo className={styles['login__form__head__logo-desktop']} type="BDBFULL" height="32px" />
            <AuthBdbAtLogo className={styles['login__form__head__logo-mobile']} type="BDB" height="32px" />
            <div className={`${styles['login__form__head__title']} sherpa-typography-heading-5`}>{titles.page}</div>
          </div>
          <div className={styles['login__form__outline']}>
            <LoginForm />
          </div>
          <div className={`${styles['login__form__habeas']} sherpa-typography-caption-1`}>
            Este sitio está protegido por reCAPTCHA y aplican las{' '}
            <a href="https://policies.google.com/privacy" target="_blank">
              políticas de privacidad
            </a>{' '}
            y los{' '}
            <a href="https://policies.google.com/terms" target="_blank">
              términos de servicio de Google
            </a>
            .
          </div>
        </div>

        <div className="col-xs-12 col-sm-12 col-lg-5 col-lg-offset-1" data-testid="login-info">
          <div className={styles['login__right-side']}>
            <span className={styles['login__right-side__version']}>{version}</span>
          </div>
          <div className={styles['login__info']}>
            <LoginBanner />
            <div className={styles['login__info__carousel']}>
              <div className={`${styles['login__info__carousel__title']} sherpa-typography-label-1`}>
                {titles.carousel}
              </div>
              <AuthBdbMlHorizontalSelector
                data-testid="carousel"
                withIcons
                buttonWidth={124}
                selectionValues={carouselOptions}
                onMlHorizontalSelectorClicked={e => productSelection(e.detail)}
              />
            </div>
          </div>
        </div>
      </Layout>
      {showModalProducts && (
        <ModalProducts title={titles.products} data={products} onClose={data => setShowModalProducts(data)} />
      )}
    </div>
  );
};

export default Login;
