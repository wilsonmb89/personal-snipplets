import React from 'react';
import styles from './Layout.module.scss';

interface LayoutProps {
  children?: React.ReactNode;
  slot?: string;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div slot="content" className={styles['layout']}>
      <div className="sherpa-grid">
        <div className="sherpa-container">
          <div className="row">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
