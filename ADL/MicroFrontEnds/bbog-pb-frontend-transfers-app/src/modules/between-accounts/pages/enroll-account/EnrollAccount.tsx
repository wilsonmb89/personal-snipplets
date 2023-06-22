import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import LayoutHeader from '../../../../components/core/layout-header/LayoutHeader';
import LayoutSummary from '../../../../components/core/layout-summary/LayoutSummary';
import { CATALOG_NAME } from '../../../../constants/catalog-names';
import { ProductTypes, ProductType, PRODUCT_TYPES } from '../../../../constants/bank-codes';
import { NotificationControl, NotificationData } from '../../../../notification/Notification';
import { AffiliatedAccount } from '../../../../store/affiliated-accounts/afilliated-accounts.entity';
import { fetchCatalog } from '../../../../store/catalogs/catalogs.effect';
import EnrollHolderForm from '../../components/enroll-holder-destination-form/EnrollHolderForm';
import EnrollAccountDestinationForm from '../../components/enroll-account-destination-form/EnrollAccountDestinationForm';
import { getNavigationPath, BetweenAccountPages, BetweenAccountPaths } from '../../constants/navigation-paths';
import { Documents } from '../../../../constants/document';
import { getDropdownNamedCatalog } from '../../../../store/catalogs/catalogs.select';
import showNotificationModal from '../../../../notification';

const getProductTypeName = (productType: ProductType): string => {
  if (!productType) return '';

  if (productType === ProductTypes.ELECTRONIC_DEPOSIT) return '';

  const name = PRODUCT_TYPES.find(product => product.value === productType).text;

  return `${name} No. `;
};

const EnrollAccount = (): JSX.Element => {
  const location = useLocation();
  const isAccountStep = location.pathname.includes(BetweenAccountPaths.ENROLL_DESTINATION_ACCOUNT);

  const { error: catalogError } = useSelector(getDropdownNamedCatalog(CATALOG_NAME.BANK_LIST));

  const initialAccountForm: Partial<AffiliatedAccount> = {
    productBank: null,
    productType: null,
    productNumber: null,
    bankId: null,
    aval: null
  };

  const initialHolderForm: Partial<AffiliatedAccount> = {
    customer: {
      name: null,
      identificationType: Documents.CC,
      identificationNumber: null
    },
    productAlias: undefined
  };

  const [step, setStep] = useState('account');
  const [dataAccountForm, setDataAccountForm] = useState(initialAccountForm);
  const [dataHolderForm, setDataHolderForm] = useState(initialHolderForm);
  const [showBackdrop, setShowBackdrop] = useState(false);

  useEffect(() => {
    if (catalogError) {
      handleError();
    }
  }, [catalogError]);

  const handleError = (): void => {
    const notificationDelete: NotificationData = {
      type: 'error',
      name: 'Algo ha fallado',
      message: 'En estos momentos no podemos realizar la operación. Por favor inténtalo nuevamente más tarde.'
    };
    const deleteActions: NotificationControl[] = [{ text: 'Entendido', action: () => goBack() }];
    showNotificationModal(notificationDelete, deleteActions);
  };

  const avatarValues = {
    color: 'white',
    icon: dataAccountForm.productType === ProductTypes.CHECK_ACCOUNT ? 'ico-cuenta-corriente' : 'ico-saving',
    text: ''
  };

  const headerValues = {
    title: dataHolderForm?.productAlias ? dataHolderForm.productAlias : 'Nueva cuenta',
    desc: dataAccountForm?.productBank ? dataAccountForm.productBank : '-',
    desc2: `${getProductTypeName(dataAccountForm.productType)}${
      dataAccountForm?.productNumber ? dataAccountForm.productNumber : '-'
    }`
  };

  const detailValues = [
    { title: 'Titular:', value: dataHolderForm?.customer?.name ? dataHolderForm.customer.name : '-' },
    {
      title: 'Documento:',
      value: `${dataHolderForm.customer.identificationType} ${
        dataHolderForm?.customer?.identificationNumber ? dataHolderForm.customer.identificationNumber : ''
      }`
    }
  ];

  const modalProps: NotificationData = {
    type: 'warning',
    name: '¿Estas seguro de abandonar la transacción?',
    message: 'Si abandonas perderás el proceso realizado'
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCatalog({ catalogName: CATALOG_NAME.BANK_LIST }));
  }, []);

  useEffect(() => {
    isAccountStep ? setStep('account') : setStep('holder');
  }, [isAccountStep]);

  const goBack = (): void => {
    isAccountStep ? goForward() : navigate(getNavigationPath(BetweenAccountPages.ENROLL_DESTINATION_ACCOUNT));
  };

  const goForward = (): void => {
    navigate(getNavigationPath(BetweenAccountPages.ACCOUNTS_LIST));
  };

  return (
    <LayoutHeader {...{ goBack, goForward, modalProps }} titleLabel={'Inscribir cuenta'} confirmModal={isAccountStep}>
      <LayoutSummary {...{ avatarValues, headerValues, detailValues, showBackdrop, setShowBackdrop }}>
        {step === 'account' && <EnrollAccountDestinationForm {...{ dataAccountForm, setDataAccountForm }} />}
        {step === 'holder' && (
          <EnrollHolderForm {...{ dataAccountForm, dataHolderForm, setDataHolderForm, setShowBackdrop }} />
        )}
      </LayoutSummary>
    </LayoutHeader>
  );
};

export default EnrollAccount;
