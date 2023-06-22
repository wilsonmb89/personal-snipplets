import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Header from '../../../components/core/header/Header';
import Layout from '../../../components/core/layout/Layout';
import { fetchProducts } from '../../../store/products/products.effect';
import { savingsAccountsWithoutAFCSelector } from '../../../store/products/products.select';
import { Account } from '../../models/account.model';
import { limitsActions } from '../../store/fetch/fetch.reducer';
import { updateLimitActions } from '../../store/update/update.reducer';
import styles from './Accounts.module.scss';
import { AppProps } from '../../../App';
import PulseListGroup from '../../../components/pulse/pulse-list-group/PulseListGroup';

const Accounts = ({ navigate }: AppProps): JSX.Element => {
  const accounts = useSelector(savingsAccountsWithoutAFCSelector);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(limitsActions.reset());
    dispatch(updateLimitActions.reset());
  }, []);

  const selectAccountHandler = (account: Account) => {
    dispatch(updateLimitActions.setAccountForUpdate(account));
    history.push({ pathname: '/limits-form' });
  };

  const backHandler = () => {
    navigate('/dashboard');
  };

  const logoutHandler = () => {
    navigate('/logout');
  };

  return (
    <pulse-flow-thc>
      <Header slot="header" title="Topes de cuentas" onBack={backHandler} onLogout={logoutHandler}></Header>
      <Layout slot="content">
        <div className="accounts-container">
          <div className={styles['accounts-container__header']}>
            <span className={`${styles['accounts-container__header__title']} pulse-tp-hl3-comp-m`}>
              Selecciona el producto a modificar
            </span>
            <div className={`${styles['accounts-container__header__desc']} pulse-tp-bo3-comp-r`}>
              <span>Recuerda que necesitas </span>
              <span className="pulse-tp-bo3-comp-b">Token Móvil </span>
              <span>para realizar cambios</span>
            </div>
          </div>
          <div className={styles['accounts-container__body']}>
            {!!accounts && accounts.length > 0 && (
              <PulseListGroup isAccordion={false}>
                {accounts.map(account => (
                  <Fragment key={account.acctId}>
                    <pulse-list-item
                      data-testid="account-item"
                      itemid={account.acctId}
                      itemtitle={account.acctName}
                      description={`No. ${account.acctId}`}
                      avatartype="logo"
                      avatarpath={'bbog'}
                      primarynavicon={'chevron-right'}
                      onClick={selectAccountHandler.bind(null, account)}
                    ></pulse-list-item>
                  </Fragment>
                ))}
              </PulseListGroup>
            )}
          </div>
        </div>
      </Layout>
    </pulse-flow-thc>
  );
};

export default Accounts;
