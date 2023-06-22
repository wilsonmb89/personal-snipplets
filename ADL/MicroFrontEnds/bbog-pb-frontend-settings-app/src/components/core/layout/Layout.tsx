import React from 'react';

interface LayoutProps {
  children?: React.ReactNode;
  slot?: string;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div slot="content">
      <div className="pulse--grid">
        <div className="pulse-row">
          <div className="pulse-col pulse-col-sm-4 pulse-col-md-8 pulse-col-lg-10 pulse-offset-lg-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
