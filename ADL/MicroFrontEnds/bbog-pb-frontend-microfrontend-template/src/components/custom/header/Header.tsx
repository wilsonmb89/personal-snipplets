import React from 'react';

import styles from './Header.module.scss';
import backIcon from '../assets/imgs/header/back-icon.svg';
import exitIcon from '../assets/imgs/header/exit-icon.svg';

interface HeaderProps {
  headerTitle: string;
  leftText?: string;
  rightText?: string;
  leftAction?: () => void;
  rightAction?: () => void;
}

const Header = ({ headerTitle, leftText, rightText, leftAction, rightAction }: HeaderProps): JSX.Element => {
  return (
    <div className={`${styles['header-container']} sherpa-grid`}>
      <div className="row">
        <div className="col-xs-2 col-md-3">
          {leftAction && (
            <div className={styles['header-container__left-action']} onClick={leftAction}>
              <img src={backIcon} alt="back-icon" />
              {leftText && <span className="roboto-regular">{leftText}</span>}
            </div>
          )}
        </div>
        <div className={`${styles['header-container__title']} col-xs-8 col-md-6`}>
          <span className="roboto-regular">{headerTitle}</span>
        </div>
        <div className="col-xs-2 col-md-3">
          {rightAction && (
            <div className={styles['header-container__right-action']} onClick={rightAction}>
              {rightText && <span className="roboto-regular">{rightText}</span>}
              <img src={exitIcon} alt="exit-icon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
