import React, { Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ScheduledTransferForm.module.scss';
import { fetchCatalog } from '../../../../store/catalogs/catalogs.effect';
import { getDropdownNamedCatalog } from '../../../../store/catalogs/catalogs.select';
import { CATALOG_NAME } from '../../../../constants/catalog-names';
import { diacriticInputText } from '../../../../utils/text.utils';
import { fieldRegistry } from '../../../../utils/utils';
import { useCreateScheduledTransfer } from '../../hooks/useCreateScheduledTransfer.hook';
import { useDeleteScheduledTransfer } from '../../hooks/useDeleteScheduledTransfer.hook';
import { useScheduledTransfer } from '../../hooks/useScheduledTransfer.hook';
import { useScheduledTransferValidators } from '../../hooks/useScheduledTransferValidators.hook';
import { useUpdateScheduledTransfer } from '../../hooks/useUpdateScheduledTransfer.hook';
import { getScheduleTransferSelected } from '../../store/selected/scheduled-transfer-selected.select';
import { scheduledTransferSelectedActions } from '../../store/selected/scheduled-transfer-selected.reducer';
import { fromISOStringToDate } from '../../../../utils/date.utils';
import { catalogsActions } from '../../../../store/catalogs/catalogs.reducer';
import {
  TransfersBdbAtCheckButton,
  TransfersBdbAtDropdown,
  TransfersBdbAtInput,
  TransfersBdbMlDatePicker
} from '../../../../constants/sherpa-tagged-components';

export interface ScheduledTransferFormInputs {
  accountFrom: string;
  amount: string;
  count: string;
  description: string;
  destinationAccountHolderIdNumber: string;
  destinationAccountHolderIdType: string;
  frequency: string;
  indefinite: boolean;
  nextExecutionDate: string;
}

interface ScheduledTransferFormProps {
  isUpdate: boolean;
  onError: () => void;
}

const ScheduledTransferForm = ({ isUpdate, onError }: ScheduledTransferFormProps): JSX.Element => {
  let data: ScheduledTransferFormInputs;
  const dispatch = useDispatch();
  const [isModify, setIsModify] = useState(false);

  const [calendarIsValid, setCalendarIsValid] = useState(false);

  const scheduleTransferSelected = useSelector(getScheduleTransferSelected);
  const { items: frequencyOptions, error: catalogError } = useSelector(
    getDropdownNamedCatalog(CATALOG_NAME.SCHEDULED_TRANSFERS_FREQUENCY)
  );
  const { register, handleSubmit, setValue, formState, getValues, watch, trigger } =
    useForm<ScheduledTransferFormInputs>({ mode: 'onChange' });
  const { isDirty, isValid } = formState;

  const { accountsDropdown, setAccountDefaultValue, getAccountFormValue } = useScheduledTransfer();
  const { indefiniteDisable, indefiniteCheck, limitDate, toogleCheck, validateIndefiniteCheck, validateFrecuency } =
    useScheduledTransferValidators();

  const { createScheduledTransferData } = useCreateScheduledTransfer();
  const { updateScheduledTransferData } = useUpdateScheduledTransfer();
  const { deleteScheduled } = useDeleteScheduledTransfer();

  const { minAllowed, maxAllowed } = limitDate;

  const indefiniteCheckValues = [
    { label: 'Repetir transferencia indefinidamente', value: 'true', isChecked: `${indefiniteCheck}` }
  ];

  useEffect(() => {
    dispatch(fetchCatalog({ catalogName: CATALOG_NAME.SCHEDULED_TRANSFERS_FREQUENCY }));
  }, []);

  useEffect(() => {
    if (isUpdate) {
      validateIndefiniteCheck(scheduleTransferSelected);
      fillFormFields();
      validateCalendar();
    } else {
      dispatch(scheduledTransferSelectedActions.reset());
      setValue('amount', '');
    }
    data = getValues();
  }, [scheduleTransferSelected]);

  useEffect(() => {
    const subscription = watch(newData => {
      return setIsModify(JSON.stringify(data) !== JSON.stringify(newData));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (catalogError && onError) {
      dispatch(catalogsActions.reset());
      onError();
    }
  }, [catalogError]);

  const fillFormFields = () => {
    const { description, accountFrom, amount, frequency, scheduledCount, nextExecutionDate, pendingCount, recurrent } =
      scheduleTransferSelected;
    setValue('description', description);
    setValue('accountFrom', getAccountFormValue(accountFrom));
    setValue('amount', new Intl.NumberFormat('es-CO').format(amount));
    setValue('frequency', frequency);
    setValue('nextExecutionDate', new Date(nextExecutionDate).toISOString().slice(0, 10));
    setValue('count', (scheduledCount - pendingCount).toString());
    setValue('indefinite', recurrent && scheduledCount === 0);
  };

  const handleAccountFromSelect = (event: CustomEvent) => {
    const acctValue: string = event.detail.value;
    setValue('accountFrom', acctValue, { shouldDirty: true, shouldValidate: true });
  };

  const handleFrecuencySelect = (event: CustomEvent) => {
    validateFrecuency(event.detail.value);
    const frecValue: string = event.detail.value;
    setValue('frequency', frecValue, { shouldDirty: true, shouldValidate: true });
    trigger('frequency');
  };

  const handleIndefiniteCheck = (event: CustomEvent) => {
    const isCheckedValue = event.detail[0].isChecked === 'true';
    toogleCheck();
    setValue('count', '');
    setValue('indefinite', isCheckedValue);
    trigger('indefinite');
  };

  const handleDatePicketSelect = (event: CustomEvent): void => {
    const stringFormatDate: string = event.detail[0]?.toISOString().slice(0, 10);
    setValue('nextExecutionDate', stringFormatDate);
    validateCalendar();
  };

  const getDateToForm = (): Array<Date> => {
    const valueFormDates = getValues('nextExecutionDate');
    return valueFormDates ? [fromISOStringToDate(valueFormDates)] : [];
  };

  const validateCalendar = (): void => {
    const datesValues = getDateToForm();
    if (datesValues.length === 1) {
      setCalendarIsValid(true);
    } else {
      setCalendarIsValid(false);
    }
  };

  const setStatusCheck = (): string => {
    const countError = formState.errors.count ? 'ERROR' : 'ENABLED';
    return indefiniteCheck ? 'DISABLED' : countError;
  };

  const setDisabledButton = (): boolean => {
    const isFilled = isUpdate ? isModify : isDirty;
    const formIsValid = isValid && calendarIsValid;
    return !isFilled || !formIsValid;
  };

  const validateService: SubmitHandler<ScheduledTransferFormInputs> = (formData: ScheduledTransferFormInputs) => {
    isUpdate ? updateScheduledTransferData(formData) : createScheduledTransferData(formData);
  };

  return (
    <Fragment>
      <form noValidate onSubmit={handleSubmit(validateService)} data-testid="scheduled-transfer-form">
        <div className={styles['form-container']}>
          <input type="hidden" {...register('destinationAccountHolderIdType')} />
          <input type="hidden" {...register('destinationAccountHolderIdNumber')} />

          <TransfersBdbAtInput
            data-testid="description"
            label="Nombre de la programación"
            placeholder="Ejemplo: Mensualidad arriendo"
            required="true"
            message="Este campo es requerido"
            maxlength={25}
            onAtInputUpdated={event => diacriticInputText(event)}
            style={{ gridArea: 'description' }}
            {...fieldRegistry(register('description', { required: 'Este campo es requerido' }))}
          />
          {accountsDropdown && accountsDropdown.length > 0 && (
            <TransfersBdbAtDropdown
              data-testid="account"
              name="originAccount"
              label="Cuenta de origen"
              placeholder="Seleccione"
              message="Este campo es requerido"
              options={JSON.stringify(accountsDropdown)}
              defaultvalue={setAccountDefaultValue()}
              style={{ gridArea: 'account' }}
              status={isUpdate ? 'DISABLED' : 'ENABLED'}
              onElementSelectedAtom={handleAccountFromSelect.bind(this)}
              {...fieldRegistry(register('accountFrom', { required: true }))}
            ></TransfersBdbAtDropdown>
          )}
          <TransfersBdbAtInput
            data-testid="amount"
            label="Monto a transferir"
            required="true"
            message="El valor no puede ser menor a $1"
            type="AMOUNT"
            maxlength="13"
            style={{ gridArea: 'mount' }}
            status={formState.errors.amount ? 'ERROR' : 'ENABLED'}
            {...fieldRegistry(register('amount', { required: 'Este campo es requerido', min: 1 }))}
          />
          {frequencyOptions && frequencyOptions.length > 0 && (
            <TransfersBdbAtDropdown
              data-testid="frequency"
              name="frequency"
              label="Quieres que se repita"
              placeholder="Seleccionar"
              message="Este campo es requerido"
              options={JSON.stringify(frequencyOptions)}
              defaultvalue={scheduleTransferSelected.frequency}
              style={{ gridArea: 'frequency' }}
              onElementSelectedAtom={handleFrecuencySelect.bind(this)}
              {...fieldRegistry(register('frequency', { required: true }))}
            ></TransfersBdbAtDropdown>
          )}
          {frequencyOptions && frequencyOptions.length > 0 && (
            <div className={styles['form-container__indefinite']} style={{ gridArea: 'indefinite' }}>
              <TransfersBdbAtCheckButton
                data-testid="indefinite"
                isDisabled={indefiniteDisable}
                values-to-check={JSON.stringify(indefiniteCheckValues)}
                onCheckEmitter={handleIndefiniteCheck.bind(this)}
                {...register('indefinite', { value: indefiniteCheck })}
              />
            </div>
          )}
          <TransfersBdbAtInput
            data-testid="count"
            tooltip
            tooltipTitle=""
            tooltipPosition="center"
            tooltipMessage="Ingresa en este campo la cantidad de transferencias que quieres que se realicen automáticamente"
            label="Cantidad de veces"
            placeholder="# veces"
            type="NUMBER"
            required="true"
            message="La cantidad debe ser positiva"
            maxlength="3"
            style={{ gridArea: 'count' }}
            status={setStatusCheck()}
            {...fieldRegistry(
              register('count', {
                required: !indefiniteCheck,
                validate: value => (!indefiniteCheck ? +value >= 1 : +value === 0)
              })
            )}
          />
          <TransfersBdbMlDatePicker
            data-testid="calendar"
            future={true}
            title-calendar="Elige la fecha de inicio"
            labelFrom={isUpdate ? 'Próxima transferencia' : 'Fecha de inicio'}
            maxDate={maxAllowed}
            minDate={minAllowed}
            placeHolderFrom="Agregar fecha"
            style={{ gridArea: 'date' }}
            onDatePickerChange={handleDatePicketSelect.bind(this)}
            value={getDateToForm()}
          ></TransfersBdbMlDatePicker>
        </div>
        <div className={styles['form-container__actions']}>
          <button
            className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
            type="submit"
            disabled={setDisabledButton()}
          >
            {isUpdate ? 'Modificar' : 'Programar'}
          </button>
          {isUpdate && (
            <button
              className="bdb-at-btn bdb-at-btn--secondary bdb-at-btn--lg--ico"
              type="button"
              onClick={() => deleteScheduled(scheduleTransferSelected.scheduleId)}
            >
              <span className="ico-delete"></span>
              Eliminar programación
            </button>
          )}
        </div>
      </form>
    </Fragment>
  );
};

export default ScheduledTransferForm;
