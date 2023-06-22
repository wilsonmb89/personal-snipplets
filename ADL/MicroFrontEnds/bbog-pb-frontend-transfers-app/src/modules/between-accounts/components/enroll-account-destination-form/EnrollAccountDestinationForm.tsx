import React, { Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  TransfersBdbAtDropdown,
  TransfersBdbAtInput,
  TransfersBdbMlHorizontalSelector
} from '../../../../constants/sherpa-tagged-components';
import { fieldRegistry } from '../../../../utils/utils';
import styles from './EnrollAccountDestinationForm.module.scss';
import { getNavigationPath, BetweenAccountPages } from '../../constants/navigation-paths';
import { ELECTRONIC_DEPOSIT_CATALOG, ProductType, ProductTypes, PRODUCT_TYPES } from '../../../../constants/bank-codes';
import { useSelector } from 'react-redux';
import { CATALOG_NAME } from '../../../../constants/catalog-names';
import { getDropdownNamedCatalog, getNamedCatalog } from '../../../../store/catalogs/catalogs.select';
import { AffiliatedAccount } from '../../../../store/affiliated-accounts/afilliated-accounts.entity';
import { CatalogData } from '../../../../store/catalogs/catalogs.entity';

export interface EnrollAccountDestinationFormProps {
  dataAccountForm: Partial<AffiliatedAccount>;
  setDataAccountForm: (accountFormValues: Partial<AffiliatedAccount>) => void;
}

const EnrollAccountDestinationForm = ({
  dataAccountForm,
  setDataAccountForm
}: EnrollAccountDestinationFormProps): JSX.Element => {
  const catalogBankList = useSelector(getNamedCatalog(CATALOG_NAME.BANK_LIST));
  const [isDepositElectronic, setIsDepositElectronic] = useState(true);
  const navigate = useNavigate();

  const productTypeOptions = [
    { ...PRODUCT_TYPES[0], disabled: false },
    { ...PRODUCT_TYPES[1], disabled: false }
  ];

  const { handleSubmit, register, setValue, watch, formState } = useForm<Partial<AffiliatedAccount>>({
    mode: 'onChange'
  });

  const { isValid } = formState;
  const { items: bankList } = useSelector(getDropdownNamedCatalog(CATALOG_NAME.BANK_LIST));

  useEffect(() => {
    const productType = dataAccountForm.productType ?? ProductTypes.ELECTRONIC_DEPOSIT;
    setValue('bankId', dataAccountForm.bankId);
    setValue('productBank', dataAccountForm.productBank);
    setValue('aval', dataAccountForm.aval);
    setValue('productNumber', dataAccountForm.productNumber);
    setValue('productType', productType);
    setIsDepositElectronic(validateElectronicDeposit(getCatalogBank(dataAccountForm.bankId)));
  }, []);

  useEffect(() => {
    const productTypeId = getProductTypeOptionId(dataAccountForm.productType);
    const selector = document.querySelector(
      'transfers-bdb-ml-horizontal-selector'
    ) as HTMLBdbMlHorizontalSelectorElement;

    if (selector && selector.selectorClicked) {
      selector.selectorClicked(productTypeId);
    }
  }, [isDepositElectronic]);

  useEffect(() => {
    const subscription = watch(newData => {
      setDataAccountForm({ ...dataAccountForm, ...newData });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const getProductTypeOptionId = (productType: ProductType): number => {
    if (!productType) return;
    if (productType === ProductTypes.ELECTRONIC_DEPOSIT) return;

    return productTypeOptions.find(item => item.value === productType).id;
  };

  const selectBankingEntity = (event: CustomEvent): void => {
    const selectedBankId = event.detail.value;
    const selectedBank = getCatalogBank(selectedBankId);
    const isDepositiElectronic = validateElectronicDeposit(selectedBank);
    setValue('bankId', selectedBankId, { shouldValidate: true });
    setValue('productBank', selectedBank.name);
    setValue('aval', selectedBank.customFields.isAval);
    setIsDepositElectronic(isDepositiElectronic);

    if (isDepositiElectronic) {
      setValue('productType', ProductTypes.ELECTRONIC_DEPOSIT);
    }
  };

  const selectAccountType = (event: CustomEvent): void => {
    const optionValue = event.detail;
    setValue('productType', optionValue.value, { shouldValidate: true });
  };

  const validateElectronicDeposit = (bank: CatalogData): boolean => {
    if (!bank) return true;

    return bank.customFields.type === ELECTRONIC_DEPOSIT_CATALOG;
  };

  const getCatalogBank = (selectedBankId: string) => {
    if (!selectedBankId) return;

    return catalogBankList.find(item => item.id === selectedBankId);
  };

  const isSelectedProductTypeValid = (selectedProductType: ProductType): boolean => {
    if (!selectedProductType) return false;

    if (!isDepositElectronic && selectedProductType === ProductTypes.ELECTRONIC_DEPOSIT) return false;

    return true;
  };

  const nextStep: SubmitHandler<Partial<AffiliatedAccount>> = (data: Partial<AffiliatedAccount>) => {
    setDataAccountForm({ ...data });
    navigate(getNavigationPath(BetweenAccountPages.ENROLL_ACCOUNT_HOLDER));
  };

  return (
    <Fragment>
      <div className={`${styles['account-destination-form__epigraph']} sherpa-typography-body-2`}>Paso 1 de 2</div>
      <div className={`${styles['account-destination-form__title']} sherpa-typography-heading-7`}>
        ¿A qué cuenta quieres transferir?
      </div>
      <div className={`${styles['account-destination-form__subtitle']} sherpa-typography-body-2`}>
        Recuerda que solo puedes inscribir cuentas de bancos en Colombia.
      </div>
      <form noValidate onSubmit={handleSubmit(nextStep)} data-testid="enroll-account-form">
        <div className={styles['account-destination-form__banking-entity']}>
          <TransfersBdbAtDropdown
            data-testid="bankingEntity"
            idEl="bankingEntity"
            label="Entidad bancaria"
            placeholder="Selecciona el banco"
            status="ENABLED"
            message="Este campo es requerido"
            options={JSON.stringify(bankList)}
            defaultvalue={dataAccountForm.bankId}
            onElementSelectedAtom={selectBankingEntity.bind(this)}
            {...fieldRegistry(register('bankId', { required: true }))}
          ></TransfersBdbAtDropdown>
        </div>
        <div className={styles['account-destination-form__account-number']}>
          <TransfersBdbAtInput
            data-testid="productNumber"
            idEl="productNumber"
            label="Número de la cuenta"
            maxlength="13"
            message="El valor es requerido"
            placeholder="#"
            regex="([1-9]+([.][0-9]+)*)"
            type="NUMBER"
            {...fieldRegistry(register('productNumber', { required: true }))}
          />
        </div>
        {!isDepositElectronic && (
          <div className={`${styles['account-destination-form__selector']} sherpa-typography-body-2`}>
            <div className={`${styles['account-destination-form__selector__label']} sherpa-typography-body-2`}>
              Selecciona el tipo de cuenta
            </div>
            <TransfersBdbMlHorizontalSelector
              data-testid="productType"
              selection-values={JSON.stringify(productTypeOptions)}
              onMlHorizontalSelectorClicked={selectAccountType.bind(this)}
              {...fieldRegistry(
                register('productType', {
                  required: !isDepositElectronic,
                  validate: selectedProductType => isSelectedProductTypeValid(selectedProductType)
                })
              )}
            ></TransfersBdbMlHorizontalSelector>
          </div>
        )}

        <div className={styles['account-destination-form__button']}>
          <button className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg" type="submit" disabled={!isValid}>
            Continuar
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default EnrollAccountDestinationForm;
