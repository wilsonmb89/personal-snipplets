import React from 'react';
import styles from './LimitFormWarning.module.scss';

export interface LimitFormWarningProps {
  warningInfo: string;
}

const LimitFormWarning = ({ warningInfo }: LimitFormWarningProps): JSX.Element => {
  return (
    <div className={styles['limit-form-warning-container']}>
      <div className={styles['limit-form-warning-container__icon']}>
        <pulse-avatar size="s" icon="megaphone" avatartype="icon"></pulse-avatar>
      </div>
      <div className={styles['limit-form-warning-container__text']}>
        <span className="pulse-tp-bo3-comp-b">Recuerda: </span>
        <span className="pulse-tp-bo3-comp-r">{warningInfo}</span>
      </div>
    </div>
  );
};

export default LimitFormWarning;
