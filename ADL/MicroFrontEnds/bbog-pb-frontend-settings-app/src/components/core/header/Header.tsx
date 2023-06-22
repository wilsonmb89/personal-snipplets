import React from 'react';
import { useHistory } from 'react-router-dom';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onLogout?: () => void;
  slot?: string;
}

const Header = ({ title, onBack, onLogout }: HeaderProps): JSX.Element => {
  const history = useHistory();

  const handleBack = () => {
    onBack ? onBack() : history.goBack();
  };

  return (
    <div slot="header">
      <pulse-flowth>
        <div slot="left-content">
          <pulse-nav-button only-icon-device="sm,md" onClick={handleBack}>
            Atrás
          </pulse-nav-button>
        </div>
        <div slot="content">{title}</div>
        <div slot="right-content">
          <pulse-nav-button only-icon-device="sm,md" icon-position="right" icon="exit" onClick={onLogout}>
            Salida segura
          </pulse-nav-button>
        </div>
      </pulse-flowth>
    </div>
  );
};

export default Header;
