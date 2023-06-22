import React from 'react';

import styles from './TwoAuthFactorLayout.module.scss';
import { MiscellaneousBdbMlHeaderBv } from '@constants/sherpaTaggedComponents';

export interface TwoAuthFactorLayoutProps {
  headerTitle: string;
  onForwardBtnClicked: () => void;
  children?: React.ReactNode;
  slot?: string;
}

const TwoAuthFactorLayout = ({ headerTitle, onForwardBtnClicked, children }: TwoAuthFactorLayoutProps): JSX.Element => {
  return (
    <div data-testid="two-auth-factor-layout" className={styles['auth-container']}>
      <div className={styles['auth-container__header']}>
        <MiscellaneousBdbMlHeaderBv
          data-testid="header"
          hiddenBack={true}
          rigthButtonLabel="Abandonar"
          rigthIcon="ico-close"
          titleLabel={headerTitle || ''}
          onForwardBtnClicked={onForwardBtnClicked}
        />
      </div>
      <div className="sherpa-grid">
        <div className="sherpa-container">
          <div className={`col-xs-12 col-lg-6 col-lg-offset-3`}>
            <div className={styles['auth-container__content']}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoAuthFactorLayout;
