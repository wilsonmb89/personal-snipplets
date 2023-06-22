import React, { Fragment, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TransfersBdbAtDropdown, TransfersBdbAtInput } from '../../../../constants/sherpa-tagged-components';
import { AffiliatedAccount } from '../../../../store/affiliated-accounts/afilliated-accounts.entity';
import { addNewAccount } from '../../store/add/account-add.effects';
import { fieldRegistry } from '../../../../utils/utils';
import styles from './EnrollHolderForm.module.scss';
import { Document, DOCUMENTS_INFO, DocumentType } from '../../../../constants/document';
import { useNavigate } from 'react-router-dom';
import { getNavigationPath, BetweenAccountPages } from '../../constants/navigation-paths';
import { globalFunctions } from '../../../../global-functions';

import { useValidateView } from '../../hooks/useValidateView.hook';
import { typeAccount } from '../../../../components/core/account-list/useAccountsList.hook';
import { Severities } from '../../../../constants/severity';
import { NotificationControl, NotificationData } from '../../../../notification/Notification';
import showNotificationModal from '../../../../notification';
import { BUSINESS_ERROR_CODE } from '../../../../constants/error-new-account';
export interface EnrollHolderFormProps {
  dataAccountForm: Partial<AffiliatedAccount>;
  dataHolderForm: Partial<AffiliatedAccount>;
  setDataHolderForm: (accountFormValues: Partial<AffiliatedAccount>) => void;
  setShowBackdrop: (value: boolean) => void;
}

const EnrollHolderForm = ({
  dataAccountForm,
  dataHolderForm,
  setDataHolderForm,
  setShowBackdrop
}: EnrollHolderFormProps): JSX.Element => {
  const dropdownValues: Document[] = DOCUMENTS_INFO;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { handleSubmit, register, setValue, watch, formState } = useForm<Partial<AffiliatedAccount>>({
    mode: 'onChange'
  });
  const { isDirty, isValid } = formState;

  const { saveAccountSelected } = useValidateView();

  useEffect(() => {
    const customer = dataHolderForm.customer;

    setValue('productAlias', dataHolderForm.productAlias);
    setValue('customer.identificationType', identificationType());

    if (customer) {
      setValue('customer.name', dataHolderForm.customer.name);
      setValue('customer.identificationNumber', dataHolderForm.customer.identificationNumber);
    }
  }, []);

  useEffect(() => {
    const subscription = watch(newData => {
      setDataHolderForm({ ...dataHolderForm, ...newData });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleAccountFromSelect = (event: CustomEvent) => {
    const frecValue: DocumentType = event.detail.value;
    setValue('customer.identificationType', frecValue, { shouldDirty: true, shouldValidate: true });
  };

  const identificationType = (): DocumentType => {
    return dataHolderForm.customer?.identificationType ?? dropdownValues[0].value;
  };

  const enrollAccount: SubmitHandler<Partial<AffiliatedAccount>> = (data: Partial<AffiliatedAccount>) => {
    const newAccount: Partial<AffiliatedAccount> = { ...data, ...dataAccountForm };
    Promise.resolve(dispatch(addNewAccount(newAccount)))
      .then(() => {
        navigate(getNavigationPath(BetweenAccountPages.ACCOUNTS_LIST));
        globalFunctions.toastFn = () => {
          const { bankId, productBank, productNumber, productType } = dataAccountForm;
          saveAccountSelected({
            avatar: {
              color: 'scooter',
              size: 'sm',
              text: dataHolderForm.productAlias
            },
            bankId,
            icon: '',
            description: `${typeAccount(productType)}${productNumber}`,
            productBankName: productBank,
            productNumber,
            title: dataHolderForm.productAlias,
            productType
          });
          navigate(getNavigationPath(BetweenAccountPages.TRANSFER_TO_ACCOUNT_AMOUNT));
        };
      })
      .catch(({ status, data }) => {
        let notificationEnroll: NotificationData;
        let enrollActions: NotificationControl[];
        if (status === BUSINESS_ERROR_CODE) {
          const { title, message } = data?.data.customerErrorMessage;
          notificationEnroll = {
            message,
            name: title,
            type: Severities.error
          };
          enrollActions = [
            { text: 'Entendido', action: () => navigate(getNavigationPath(BetweenAccountPages.ACCOUNTS_LIST)) }
          ];
          showNotificationModal(notificationEnroll, enrollActions);
        } else {
          notificationEnroll = {
            type: Severities.warning,
            name: '!Ups¡ algo salió mal',
            message: 'En este momento presentamos problemas con el servicio. Por favor inténtalo de nuevo.'
          };
          enrollActions = [
            { text: 'Cerrar', action: () => navigate(getNavigationPath(BetweenAccountPages.ACCOUNTS_LIST)) }
          ];
          showNotificationModal(notificationEnroll, enrollActions);
        }
      });
  };

  return (
    <Fragment>
      <div className={`${styles['holder-form__epigraph']} sherpa-typography-body-2`}>Paso 2 de 2</div>
      <div className={`${styles['holder-form__title']} sherpa-typography-heading-7`}>
        ¿Quién es el titular de la cuenta?
      </div>
      <div className={`${styles['holder-form__subtitle']} sherpa-typography-body-2`}>
        Recuerda no usar: puntos, comas, tildes o caracteres especiales.
      </div>
      <form noValidate onSubmit={handleSubmit(enrollAccount)} data-testid="enroll-holder-form">
        <div className={styles['holder-form__names-holder']}>
          <TransfersBdbAtInput
            data-testid="namesHolder"
            idEl="namesHolder"
            autoSelect={false}
            label="Nombre del titular"
            placeholder="Nombres y apellidos"
            message="Este campo es requerido"
            maxlength={40}
            type="TEXTWITHOUTDIACRITICS"
            {...fieldRegistry(register('customer.name', { required: true }))}
          />
        </div>
        <div className={styles['holder-form__document']}>
          <div className={styles['holder-form__document__type']}>
            <TransfersBdbAtDropdown
              data-testid="documenType"
              idEl="documenType"
              defaultvalue={identificationType()}
              label="Documento"
              message="Este campo es requerido"
              name="originAccount"
              options={dropdownValues}
              placeholder="Seleccione"
              onElementSelectedAtom={handleAccountFromSelect.bind(this)}
            ></TransfersBdbAtDropdown>
          </div>

          <div className={styles['holder-form__document__number']}>
            <TransfersBdbAtInput
              data-testid="documenNumber"
              idEl="documenNumber"
              autoSelect={false}
              label="Número"
              placeholder="#"
              type="NUMBER"
              message="El valor es requerido"
              regex="([1-9]+([.][0-9]+)*)"
              maxlength={15}
              {...fieldRegistry(register('customer.identificationNumber', { required: true }))}
            />
          </div>
        </div>

        <div className={styles['holder-form__customized-name']}>
          <TransfersBdbAtInput
            data-testid="customizedName"
            idEl="customizedName"
            label="Nombre personalizado"
            autoSelect={false}
            placeholder="Ej: Cuenta madre"
            message="Este campo es requerido"
            maxlength={20}
            type="TEXTWITHOUTDIACRITICS"
            {...fieldRegistry(register('productAlias', { required: true }))}
          />
        </div>

        <div className={styles['holder-form__actions']}>
          <div className={styles['holder-form__actions__summary']}>
            <button
              className="bdb-at-btn bdb-at-btn--secondary bdb-at-btn--lg--ico"
              type="button"
              onClick={() => setShowBackdrop(true)}
            >
              Ver resumen
            </button>
          </div>

          <div className={styles['holder-form__actions__enroll']}>
            <button
              className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
              type="submit"
              disabled={!isDirty || !isValid}
            >
              Inscribir
            </button>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default EnrollHolderForm;
