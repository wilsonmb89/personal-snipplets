import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styles from './ScheduledTransferAcctCheck.module.scss';
import Layout from '../../../../components/core/layout/Layout';
import { AppDispatch } from '../../../../store';
import {
  getValidAffiliated,
  getValidAffiliatedAndProducts
} from '../../../../store/affiliated-accounts/afilliated-accounts.select';
import { fetchProducts } from '../../../../store/products/products.effect';
import { setTargetAccountByAccountSelected } from '../../store/targetAccount/target-account.effect';
import { targetAccountActions } from '../../store/targetAccount/target-account.reducer';
import { getNavigationPath, ScheduledTranfersPages } from '../../constants/navigation-paths';
import AccountList from '../../../../components/core/account-list/AccountList';
import { useAccountsList } from '../../../../components/core/account-list/useAccountsList.hook';
import { savingsProductsWithoutAFCSelector } from '../../../../store/products/products.select';
import { TransfersBdbMlHeaderBv } from '../../../../constants/sherpa-tagged-components';

const TITLE_PAGE = 'Preparemos la programación';
const SUBTITLE_PAGE = 'Selecciona la cuenta a la cual vas a programar tu transferencia:';

const TITLE_PRIMARY = 'Cuentas propias';
const TITLE_SECUNDARY = 'Cuentas inscritas';

const ScheduledTransferAcctCheck = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const validAccounts = useSelector(getValidAffiliatedAndProducts);
  const validProducts = useSelector(savingsProductsWithoutAFCSelector);
  const validAffiliated = useSelector(getValidAffiliated);

  const [products, setProducts] = useState([]);
  const [affiliatedAccts, setAffiliatedAccts] = useState([]);

  const { handleAfiliatedAccounts, handleOwnAccounts, organizeAlphabetically, organizeForTypeAccount } =
    useAccountsList();

  useEffect(() => {
    setProducts(handleOwnAccounts(organizeForTypeAccount(validProducts)));
    setAffiliatedAccts(organizeAlphabetically(handleAfiliatedAccounts(validAffiliated)));
  }, [validProducts, validAffiliated]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const handleCardSelected = (event: CustomEvent): void => {
    const {
      detail: { value, productType, bankId }
    } = event;
    const acctSelected = validAccounts.find(
      acct => acct.productNumber === value && acct.productType === productType && acct.bankId === bankId
    );
    Promise.resolve(dispatch(setTargetAccountByAccountSelected(acctSelected))).then(() => {
      navigate(getNavigationPath(ScheduledTranfersPages.SCHEDULED_CREATE));
    });
  };

  const goBackHandler = (): void => {
    dispatch(targetAccountActions.reset());
    navigate(getNavigationPath(ScheduledTranfersPages.SCHEDULED_LIST, false));
  };

  return (
    <div className={styles['st-account-check']}>
      <div className={styles['st-account-check__header']}>
        <TransfersBdbMlHeaderBv
          data-testid="header"
          leftButtonLabel="Atrás"
          rigthButtonLabel="Abandonar"
          rigthIcon="ico-close"
          titleLabel="Programar transferencias"
          onBackBtnClicked={goBackHandler}
          onForwardBtnClicked={() => navigate('/programadas')}
        ></TransfersBdbMlHeaderBv>
      </div>
      <div className={styles['st-account-check__content']}>
        <Layout slot="content">
          <div className={styles['st-account-check__content__caption']}>
            <span className={`${styles['st-account-check__content__caption__title']} sherpa-typography-heading-6`}>
              {TITLE_PAGE}
            </span>
            <span className={`${styles['st-account-check__content__caption__subtitle']} sherpa-typography-body-2`}>
              {SUBTITLE_PAGE}
            </span>
          </div>
          {products.length > 1 && (
            <AccountList
              title={TITLE_PRIMARY}
              hiddenArrow={false}
              accounts={products}
              clickActionCard={handleCardSelected.bind(this)}
            />
          )}
          {affiliatedAccts.length > 0 && (
            <div className={styles['st-account-check__content__acct-list']}>
              <AccountList
                title={TITLE_SECUNDARY}
                hiddenArrow={false}
                accounts={affiliatedAccts}
                clickActionCard={handleCardSelected.bind(this)}
              />
            </div>
          )}
        </Layout>
      </div>
    </div>
  );
};

export default ScheduledTransferAcctCheck;
