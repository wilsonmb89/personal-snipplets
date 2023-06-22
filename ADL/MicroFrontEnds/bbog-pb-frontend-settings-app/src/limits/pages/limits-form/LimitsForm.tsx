import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { limitsTreeSelector } from '../../store/fetch/fetch.selector';
import styles from './LimitsForm.module.scss';

import Header from '../../../components/core/header/Header';
import Layout from '../../../components/core/layout/Layout';
import { updateAccountLimitSelector } from '../../store/update/update.selector';
import LimitSection from '../../components/limit-section/LimitSection';
import { tokenActions, tokenShowModalSelector } from '../../../store/token/token.store';
import { updateLimitActions } from '../../store/update/update.reducer';
import ModalToken from '../../../components/core/modal-token/ModalToken';
import Tooltip from '../../../components/pulse/pulse-tooltip/Tooltip';
import { limitsActions } from '../../store/fetch/fetch.reducer';
import { fetchTokenData } from '../../../store/token/token.effect';
import { AppProps } from '../../../App';
import { useHistory } from 'react-router-dom';
import { loadingActions } from '../../../store/loader/loader.store';
import { fetchCatalog } from '../../../store/catalogs/catalogs.effect';
import { fetchAccountLimit, fetchLimits } from '../../store/fetch/fetch.effect';
import { CatalogType } from '../../../store/catalogs/catalogs.entity';
import { useError } from '../../../store/error/error.hook';
import { useQuery } from '../../hooks/url-paramater.hook';

const LimitsForm = ({ navigate }: AppProps): JSX.Element => {
  const enableDataBtnRef = useRef(null);
  const limitsTree = useSelector(limitsTreeSelector);
  const account = useSelector(updateAccountLimitSelector);
  const [isEditionEnabled, setEditionEnabled] = useState(false);
  const showModalToken = useSelector(tokenShowModalSelector);

  const query = useQuery();

  const dispatch = useDispatch();
  const history = useHistory();

  useError(() => {
    history.push({ pathname: '/accounts' });
  }, ['Error al cargar los Topes']);

  useEffect(() => {
    dispatch(loadingActions.enable());

    dispatch(updateLimitActions.setAccountForUpdate(account));

    const fetchLimitsFormData = Promise.all([
      dispatch(fetchCatalog(CatalogType.LIMITS_BOUNDS, { disableLoader: true })),
      dispatch(fetchLimits(account, { disableLoader: true })),
      dispatch(fetchAccountLimit(account, { disableLoader: true }))
    ]);

    fetchLimitsFormData
      .then(() => {
        dispatch(loadingActions.disable());
      })
      .catch(() => {
        dispatch(loadingActions.disable());
      });
  }, []);

  const enableLimitsEdition = () => {
    dispatch(fetchTokenData());
  };

  const hideTooltip = () => {
    dispatch(limitsActions.showTooltip({}));
  };

  const logoutHandler = () => {
    navigate('/logout');
  };

  const backHandler = () => {
    query.get('origin') === 'warning' ? navigate('/legacy/dashboard') : history.goBack();
  };

  return (
    <Fragment>
      <pulse-flow-thc data-testid="limits-form-page">
        <Header slot="header" title="Topes de cuentas" onLogout={logoutHandler} onBack={backHandler}></Header>
        <Layout slot="content">
          <div className={styles['limit-tree-container']}>
            {limitsTree.map(limitTree => (
              <LimitSection key={limitTree.id} limitTree={limitTree} isEditionEnabled={isEditionEnabled} />
            ))}
          </div>
          {!isEditionEnabled && (
            <div ref={enableDataBtnRef} className={styles['change-limits-container__enable-data-btn']}>
              <pulse-button type="button" onClick={enableLimitsEdition}>
                Editar topes
              </pulse-button>
            </div>
          )}
        </Layout>
      </pulse-flow-thc>
      {!isEditionEnabled && !!enableDataBtnRef.current && (
        <Tooltip
          title="Habilita cambios"
          description="Ahora edita los valores de los topes que necesites haciendo clic aquí."
          color="primary"
          colorvariant="400"
          size="xs"
          orientation="top-middle"
          element={enableDataBtnRef.current}
          onClose={hideTooltip}
        />
      )}
      {showModalToken && (
        <ModalToken
          onSuccess={() => setEditionEnabled(true)}
          onClose={() => dispatch(tokenActions.hideTokenModal())}
        ></ModalToken>
      )}
    </Fragment>
  );
};

export default LimitsForm;
