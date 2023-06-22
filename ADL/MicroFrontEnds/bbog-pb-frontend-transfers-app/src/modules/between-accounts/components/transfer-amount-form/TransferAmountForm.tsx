import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TransfersBdbAtInput } from '../../../../constants/sherpa-tagged-components';
import { diacriticInputText } from '../../../../utils/text.utils';
import { fieldRegistry } from '../../../../utils/utils';
import { TransferAccount } from '../../store/transfer/account-transfer.entity';
import styles from './TransferAmountForm.module.scss';

export interface AmountForm {
  amount: string;
  note: string;
  numberOfBill: string;
  otro: string;
}

interface TransferAmountProps {
  updateInfo?(value: AmountForm);
  changeStep(): void;
  defaultValue: TransferAccount;
  minimunAmount: number;
  infoCost: string;
}

const TransferAmountForm = ({
  updateInfo,
  changeStep,
  defaultValue,
  minimunAmount,
  infoCost
}: TransferAmountProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, errors }
  } = useForm<AmountForm>({
    mode: 'onChange'
  });

  useEffect(() => {
    setValue('amount', defaultValue.amount);
    setValue('note', defaultValue.note);
    setValue('numberOfBill', defaultValue.numberOfBill);
  }, []);

  useEffect(() => {
    const subscription = watch(value => {
      updateInfo(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = () => changeStep();

  const valueMinimun = (value: string) => {
    // eslint-disable-next-line
    const valueNumber: number = parseFloat(value.replace(/\./g, '').replace(/\,/g, '.'));
    if (valueNumber < minimunAmount) {
      return false;
    }
    return true;
  };

  const errorsMessage = (type: string): string => {
    switch (type) {
      case 'required':
        return 'Este campo es requerido';
      case 'pattern':
        return 'Formato de valor incorrecto';
      default:
        return 'El valor no puede ser menor a $0,1';
    }
  };

  return (
    <form className={styles['container']} onSubmit={handleSubmit(onSubmit)} data-testid="transfer-form">
      <div className={`${styles['container--step']} sherpa-typography-label-1`}>Paso 1 de 2</div>
      <span className={`${styles['container--question']} sherpa-typography-heading-6`}>
        ¿Cuánto quieres transferir?
      </span>
      <div className={`${styles['container--aditional-info']} sherpa-typography-label-1`}>{infoCost}</div>
      <TransfersBdbAtInput
        data-testid="amount"
        label="Ingresa el Valor"
        required="true"
        type="DECIMALAMOUNT"
        message={errorsMessage(errors?.amount?.type)}
        status={errors.amount ? 'ERROR' : 'ENABLED'}
        maxlength={10}
        {...fieldRegistry(
          register('amount', {
            required: 'Este campo es requerido',
            min: 1,
            pattern: /^([0-9]+([.][0-9]+)*([,]\d{1,2})*)$/,
            validate: value => valueMinimun(value)
          })
        )}
      />
      <TransfersBdbAtInput
        data-testid="note"
        label="Nota (opcional)"
        placeholder="Ejemplo: Almuerzo"
        type="TEXT"
        maxlength={24}
        onAtInputUpdated={event => diacriticInputText(event)}
        {...fieldRegistry(register('note'))}
      />
      <TransfersBdbAtInput
        data-testid="numberOfBill"
        label="No. de factura (opcional)"
        placeholder="#"
        maxlength={24}
        onAtInputUpdated={event => diacriticInputText(event)}
        {...fieldRegistry(register('numberOfBill'))}
      />
      <div className={styles['container__actions']}>
        <button
          disabled={!isValid}
          data-testid="continue-button"
          className={`${styles['container__actions--continue']} bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg`}
          type="submit"
        >
          Continuar
        </button>
      </div>
    </form>
  );
};

export default TransferAmountForm;
