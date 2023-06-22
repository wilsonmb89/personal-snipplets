import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import ModalConfirm from '../../../components/core/modal-confirm/ModalConfirm';
import { ModalControls } from '../../../components/core/modal/Modal';
import { currencyToNumber, numberToCurrency } from '../../../utils/currency';
import { useLimitsForm } from '../../hooks/limits-form.hook';
import { useLimitsValidator } from '../../hooks/limits-validators.hook';
import { LimitData } from '../../store/fetch/fetch.data';
import LimitFormWarning from '../limit-form-warning/LimitFormWarning';
import styles from './LimitForm.module.scss';

interface LimitFormInputs {
  channel: string;
  amount: number | string;
  count: number;
}

export interface LimitFormProps {
  limit: LimitData;
  isEditionEnabled: boolean;
}

const LimitForm = ({ limit, isEditionEnabled }: LimitFormProps): JSX.Element => {
  const { register, handleSubmit, setValue, formState, trigger } = useForm<LimitFormInputs>();
  const { errors, isDirty } = formState;
  const { updateLimit, confirm, confirmUpdate, setConfirmData } = useLimitsForm(limit.state);
  const { validateAmountTopLimit } = useLimitsValidator(limit.state);
  const { validateCountData } = useLimitsValidator(limit.state);
  const modalConfirmControls: ModalControls = {
    primaryAction: {
      text: 'Sí, continuar',
      action: confirmUpdate
    },
    secondaryAction: {
      text: 'No, cancelar',
      action: () => setConfirmData(null)
    }
  };

  useEffect(() => {
    setValue('channel', limit.state.channel);
    setValue('amount', numberToCurrency(`${limit.state.amount}`));
    setValue('count', limit.state.count);
  }, [limit.state.amount]);

  const handleAmountData = (event: KeyboardEvent) => {
    const inputRef = event.target as HTMLInputElement;
    setValue('amount', numberToCurrency(inputRef.value));
    trigger('amount');
  };

  return (
    <form noValidate onSubmit={handleSubmit(updateLimit)} data-testid={`${limit.channel}_form`}>
      <input type="hidden" {...register('channel', { required: true })} />
      <div className={styles['limit-form-container']}>
        <div className={styles['limit-form-container__row']}>
          <div className={styles['limit-form-container__row--item']}>
            <div className={styles['limit-form-container__row--item__label']}>
              <label className="pulse-tp-bo4-comp-m">Monto máximo*</label>
            </div>
            <input
              className={
                styles['limit-form-container__row--item__input'] +
                ` ${
                  !!errors && !!errors.amount && !!errors.amount.message
                    ? styles['limit-form-container__row--item__input--error']
                    : ''
                }`
              }
              id={`${limit.channel}_amount`}
              type="text"
              autoComplete="off"
              onKeyUp={handleAmountData.bind(this)}
              {...register('amount', {
                required: 'Este campo es requerido',
                setValueAs: currencyToNumber,
                validate: validateAmountTopLimit
              })}
            />
            {!!formState && !!errors && !!errors.amount && !!errors.amount.message && (
              <div className={styles['limit-form-container__row--item__errors']}>
                <span className="pulse-tp-bo4-comp-r">{errors.amount.message}</span>
              </div>
            )}
          </div>
          {!limit.state.isAccountLimit ? (
            <div className={styles['limit-form-container__row--item']}>
              <div className={styles['limit-form-container__row--item__label']}>
                <label className="pulse-tp-bo4-comp-m">No. de transacciones diarias*</label>
              </div>
              <input
                className={
                  styles['limit-form-container__row--item__input'] +
                  ` ${
                    !!errors && !!errors.count && !!errors.count.message
                      ? styles['limit-form-container__row--item__input--error']
                      : ''
                  }`
                }
                id={`${limit.channel}_count'`}
                type="number"
                step="any"
                autoComplete="off"
                onKeyUp={() => {
                  trigger('count');
                }}
                {...register('count', {
                  required: 'Este campo es requerido',
                  max: {
                    value: 1000,
                    message: 'El límite de transacciones diarias permitidas es 1000'
                  },
                  valueAsNumber: true,
                  validate: validateCountData
                })}
              />
              {!!formState && !!errors && !!errors.count && !!errors.count.message && (
                <div className={styles['limit-form-container__row--item__errors']}>
                  <span className="pulse-tp-bo4-comp-r">{errors.count.message}</span>
                </div>
              )}
            </div>
          ) : (
            <input type="hidden" {...register('count', { required: true, valueAsNumber: true })} />
          )}
        </div>
      </div>
      {limit.content.warningInfo && <LimitFormWarning warningInfo={limit.content.warningInfo} />}
      <div className={styles['limit-container__body__form__submit-container']}>
        <pulse-button
          type="submit"
          disabled={!isEditionEnabled || !isDirty || !!errors.amount || (!limit.state.isAccountLimit && !!errors.count)}
        >
          Guardar cambios
        </pulse-button>
      </div>
      {confirm && (
        <ModalConfirm
          title={confirm.title}
          description={confirm.description}
          modalConfirmControls={modalConfirmControls}
        />
      )}
    </form>
  );
};

export default LimitForm;
