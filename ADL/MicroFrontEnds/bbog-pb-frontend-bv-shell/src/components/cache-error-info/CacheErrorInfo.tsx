import React from 'react';

import styles from './CacheErrorInfo.module.scss';
import cacheErrorIcon from '../../assets/images/cache-error-icon.svg';
import vigiladoFooterIcon from '../../assets/images/vigilado-footer-icon.svg';
import bbogIcon from '../../assets/images/bbog-icon.svg';
import bbogSmallIcon from '../../assets/images/bbog-small-icon.svg';
import { deleteApplicationCache } from '../../utils/service-worker-utils';
import { version } from '../../../package.json';

const CacheErrorInfo = (): JSX.Element => {
  const clickButtonHandler = (): void => {
    deleteApplicationCache()
      .then(() => window.location.replace('/'))
      .catch(() => window.location.replace('/'));
  };

  return (
    <div className={styles['cache-error-container']}>
      <div className={styles['cache-error-container__header']}>
        <div className={styles['cache-error-container__header__small-icon']}>
          <img width="32" height="32" src={bbogSmallIcon} alt="vigilado-icon" />
        </div>
        <div className={styles['cache-error-container__header__medium-icon']}>
          <img width="160" height="32" src={bbogIcon} alt="vigilado-icon" />
        </div>
      </div>
      <div className={styles['cache-error-container__body']}>
        <div className={styles['cache-error-container__body__icon']}>
          <img src={cacheErrorIcon} alt="error-icon" />
        </div>
        <div className={styles['cache-error-container__body__text']}>Lo sentimos, no pudimos cargar la información</div>
        <button onClick={clickButtonHandler} className={styles['cache-error-container__body__button']}>
          Volver a intentar
        </button>
      </div>
      <div className={styles['cache-error-container__footer']}>
        <div className={styles['cache-error-container__footer__text']}>
          <div className={styles['cache-error-container__footer__text__title']}>
            Para más información puedes contactarnos en Colombia a nuestra Servilínea:
          </div>
          <div className={styles['cache-error-container__footer__text__desc']}>
            Bogotá 601 382 0000 • Medellín 604 576 4330 • Cali 602 898 0077 • Barranquilla 605 350 4300 • Bucaramanga
            607 652 5500 Nivel nacional 018000 518 877.
          </div>
        </div>
        <div className={styles['cache-error-container__footer__logos']}>
          <div className={styles['cache-error-container__footer__logos__vigilado-icon']}>
            <img src={vigiladoFooterIcon} alt="vigilado-icon" />
          </div>
          <div className={styles['cache-error-container__footer__logos__version']}>v.{version}</div>
        </div>
      </div>
    </div>
  );
};

export default CacheErrorInfo;
