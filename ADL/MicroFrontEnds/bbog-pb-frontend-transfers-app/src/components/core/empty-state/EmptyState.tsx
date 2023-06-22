import React from 'react';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  buttonText: string;
  descr: string;
  img: string;
  buttonDisabled?: boolean;
  buttonIcon?: string;
  descrLink?: string;
  clickButton?(): void;
  clickLink?(): void;
}

const EmptyState = ({
  img,
  descr,
  descrLink,
  buttonIcon,
  buttonText,
  buttonDisabled = false,
  clickButton,
  clickLink
}: EmptyStateProps): JSX.Element => {
  return (
    <div className={styles['empty-state__container']} data-testid="empty-state">
      <img className={styles['empty-state__img']} src={img} alt="empty-state" />
      <div className={`${styles['empty-state__title']} sherpa-typography-body-2`}>
        {descr}
        {descrLink && (
          <div className={'sherpa-typography-body-2'}>
            "
            <span className={`${styles['empty-state__link']} sherpa-typography-body-2`} onClick={clickLink}>
              {descrLink}
            </span>
            "
          </div>
        )}
      </div>
      <button
        className={`${styles['empty-state__button']} bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg--ico`}
        disabled={buttonDisabled}
        onClick={clickButton}
      >
        {buttonIcon && <span className={buttonIcon}></span>}
        {buttonText}
      </button>
    </div>
  );
};

export default EmptyState;
