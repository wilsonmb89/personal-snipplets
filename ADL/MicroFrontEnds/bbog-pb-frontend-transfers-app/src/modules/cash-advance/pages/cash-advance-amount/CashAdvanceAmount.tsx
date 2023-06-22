import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SubmitHandler, useForm } from 'react-hook-form';

import styles from './CashAdvanceAmount.module.scss';
import { fieldRegistry } from '@utils/utils';
import { TransfersBdbAtInput } from '@constants/sherpa-tagged-components';
import { cashAdvanceWorkflowActions } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.reducer';
import { cashAdvanceWorkflowSelector } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.select';
import { CashAdvanceSteps } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.entity';
import { useCashAdvanceAmountValidator } from '@cash-advance/hooks/useCashAdvanceAmountValidator.hook';
import { numberWithDecimalToCurrency } from '@utils/currency.utils';

interface CashAdvanceAmountInputs {
  amount: string;
}

const CashAdvanceAmount = (): JSX.Element => {
  const dispatch = useDispatch();

  const { advanceAmount, cardSelected } = useSelector(cashAdvanceWorkflowSelector);

  const { validateCashAdvanceAmount } = useCashAdvanceAmountValidator();

  const [availCredit, setAvailCredit] = useState<string>('0');

  const { formState, register, handleSubmit, watch, setValue } = useForm<CashAdvanceAmountInputs>({ mode: 'onChange' });
  const { isValid, errors } = formState;

  const submitAmount: SubmitHandler<CashAdvanceAmountInputs> = () => {
    dispatch(cashAdvanceWorkflowActions.setStep(CashAdvanceSteps.Destination));
  };

  useEffect(() => {
    if (cardSelected && cardSelected.balanceInfo?.balanceDetail) {
      const balanceDetail = cardSelected.balanceInfo.balanceDetail;
      setAvailCredit(balanceDetail.AvailCredit || '0');
    }
  }, [cardSelected]);

  useEffect(() => {
    if (advanceAmount) {
      setValue('amount', advanceAmount);
    }
  }, [advanceAmount]);

  useEffect(() => {
    const subscription = watch(({ amount }) => {
      dispatch(cashAdvanceWorkflowActions.setAdvanceAmount(amount));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div data-testid="cash-advance-amount-container" className={styles['main-container']}>
      <div className={styles['main-container__header']}>
        <div className={`${styles['main-container__header__label']} roboto-regular sherpa-typography-body-2`}>
          Paso 1 de 2
        </div>
        <div className={`${styles['main-container__header__title']} roboto-medium sherpa-typography-title-1`}>
          ¿De cuánto vas a realizar el avance?
        </div>
        <div className={`${styles['main-container__header__desc']} roboto-regular sherpa-typography-body-2`}>
          Puedes realizar avances hasta por {numberWithDecimalToCurrency(availCredit)}
        </div>
      </div>
      <form
        data-testid="cash-transfer-amt-form"
        noValidate
        onSubmit={handleSubmit(submitAmount)}
        className={styles['main-container__form']}
      >
        <div className={styles['main-container__form__inputs']}>
          <TransfersBdbAtInput
            data-testid="cash-advance-amt"
            label="Valor del avance"
            required="true"
            message={errors?.amount?.message ? errors?.amount?.message : ''}
            type="DECIMALAMOUNT"
            regex="([1-9]+([.][0-9]+)*)"
            maxlength="13"
            status={formState.errors.amount ? 'ERROR' : 'ENABLED'}
            {...fieldRegistry(
              register('amount', {
                required: 'Este campo es requerido',
                validate: amount => validateCashAdvanceAmount(amount, availCredit)
              })
            )}
          />
        </div>
        <div className={styles['main-container__form__controls']}>
          <button
            data-testid="cash-advance-amount-submit-button"
            className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
            type="submit"
            disabled={!isValid}
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CashAdvanceAmount;
