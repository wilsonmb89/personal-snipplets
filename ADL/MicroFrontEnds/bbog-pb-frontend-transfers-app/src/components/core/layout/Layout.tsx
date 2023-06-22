import React from 'react';
import styles from './Layout.module.scss';

interface LayoutProps {
  children?: React.ReactNode;
  slot?: string;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div slot="content" className="layout">
      <div className="sherpa-grid">
        <div className="sherpa-container">
          <div className={`${styles['layout__body']} col-xs-12 col-sm-10 col-md-10 col-lg-10`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
