import React from 'react';
import { createPortal } from 'react-dom';
import styles from './Loader.module.scss';

const Loader = (): JSX.Element => {
  return createPortal(
    <div className={styles.loader}>
      <div role="dialog" className={styles.loader__box}>
        <svg viewBox="0 0 64 64" className={styles.loader__icon}>
          <circle className={styles.loader__circle} transform="translate(32,32)" r="26"></circle>
        </svg>
      </div>
    </div>,
    document.getElementById('overlay-root')
  );
};

export default Loader;
