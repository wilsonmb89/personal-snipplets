import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthBdbMlHeaderBv } from '@utils/sherpa-tagged-components';
import showNotificationModal from '../modal-notification';
import store from '@store/index';
interface LayoutProps {
  title: string;
  children?: React.ReactNode;
  slot?: string;
}

const FormLayout = ({ title, children }: LayoutProps): JSX.Element => {
  const navigate = useNavigate();

  const handleForward = () => {
    showNotificationModal(
      {
        type: 'warning',
        name: '¿Estás seguro de abandonar la transacción?',
        message: 'Si abandonas perderás el proceso realizado'
      },
      [{ text: 'Sí, abandonar', action: () => navigateLogin() }, { text: 'No, regresar' }]
    );
  };

  const navigateLogin = () => {
    store.dispatch({ type: 'UNMOUNT' });
    navigate('/');
  };

  return (
    <div slot="formLayout" className="layout">
      <AuthBdbMlHeaderBv
        data-testid="layout-header"
        leftButtonLabel="Atrás"
        rigthButtonLabel="Abandonar"
        rigthIcon="ico-close"
        titleLabel={title}
        onBackBtnClicked={() => navigate(-1)}
        onForwardBtnClicked={handleForward}
      ></AuthBdbMlHeaderBv>
      <div className="sherpa-grid">
        <div className="sherpa-container">
          <div className="col-xs-12 col-sm-10 col-md-10 col-lg-6 col-sm-offset-1 col-md-offset-1 col-lg-offset-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
