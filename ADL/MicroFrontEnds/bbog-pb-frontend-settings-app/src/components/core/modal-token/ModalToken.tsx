import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTokenValidation } from '../../../store/token/token.effect';
import { TokenStatus } from '../../../store/token/token.entity';
import { tokenAttemptsSelector, tokenStatusSelector } from '../../../store/token/token.store';
import PulseModalLite from '../../pulse/pulse-modal-lite/PulseModalLite';
import styles from './ModalToken.module.scss';
import tokenWarningImg from '../../../assets/token/token-warning.svg';
import tokenImg from '../../../assets/token/token.svg';

type TokenFormInputs = {
  token: string;
};

export interface ModalTokenProps {
  onSuccess: () => void;
  onClose: () => void;
}

const ModalToken = ({ onSuccess, onClose }: ModalTokenProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    trigger,
    setValue
  } = useForm<TokenFormInputs>();
  const status: TokenStatus = useSelector(tokenStatusSelector);
  const attempts: number = useSelector(tokenAttemptsSelector);
  const dispatch = useDispatch();

  const fetchAttempt = (inputs: TokenFormInputs) => {
    Promise.all([dispatch(fetchTokenValidation(inputs.token))])
      .then(onSuccess)
      .catch(() => {
        setValue('token', '');
      });
  };

  const validateLenght = (event: InputEvent) => {
    const inputElementRef = event.target as HTMLInputElement;
    if (!!inputElementRef && !!inputElementRef.value && inputElementRef.value.length > 6) {
      const value = inputElementRef.value;
      inputElementRef.value = value.slice(0, 6);
    }
  };

  return (
    <PulseModalLite size="default" willDismiss={null}>
      <pulse-modaltb>
        <div slot="header">
          <div className={styles['modal-token-container__btn-close']} onClick={onClose}>
            <pulse-icon data-testid="close-modal-token-button" icon="close"></pulse-icon>
          </div>
        </div>
        <div slot="content">
          <pulse-modaltc title={null}>
            <div slot="icon">
              <img src={status === TokenStatus.basic ? tokenImg : tokenWarningImg} alt="token" />
            </div>
            <div slot="title">
              {status === TokenStatus.basic && (
                <Fragment>
                  <span className="pulse-tp-hl3-comp-r">Código</span> Token
                </Fragment>
              )}
              {status === TokenStatus.wrong && <span>Token incorrecto</span>}
              {status === TokenStatus.fail && <Fragment>Algo ocurrió con tu Token</Fragment>}
              {status === TokenStatus.need && <Fragment>Activa tu Token Móvil</Fragment>}
            </div>
            <div slot="body">
              <div className={styles['modal-token-container__body']}>
                {(status === TokenStatus.basic || status === TokenStatus.wrong) && (
                  <Fragment>
                    <span>
                      {` Para realizar este proceso, ${
                        status === TokenStatus.basic ? 'ingresa' : 'vuelve a ingresar'
                      } el código de Token Móvil.`}
                    </span>
                    <div className={styles['modal-token-container__body__form-container']}>
                      <form noValidate onSubmit={handleSubmit(fetchAttempt)}>
                        <div className={styles['modal-token-container__body__form-container__form']}>
                          <input
                            data-testid="token-input-text"
                            id="token-input"
                            name="token-input"
                            autoComplete="off"
                            className={
                              styles['modal-token-container__body__form-container__form__input'] +
                              ` ${
                                !!errors.token && !!errors.token.message
                                  ? styles['modal-token-container__body__form-container__form__input--error']
                                  : ''
                              }`
                            }
                            type="number"
                            autoFocus
                            onInput={validateLenght.bind(this)}
                            onKeyUp={() => {
                              trigger('token');
                            }}
                            defaultValue=""
                            {...register('token', {
                              required: 'Este campo es requerido',
                              minLength: 6,
                              maxLength: {
                                value: 6,
                                message: 'El código de Token debe tener 6 dígitos'
                              }
                            })}
                          />
                          <div className={styles['modal-token-container__body__form-container__form__errors']}>
                            <span className="pulse-tp-bo4-comp-r">
                              {status === TokenStatus.wrong
                                ? `Código incorrecto, te queda${attempts === 1 ? '' : 'n'} ${attempts} intento${
                                    attempts === 1 ? '' : 's'
                                  }`
                                : !!errors.token && !!errors.token.message
                                ? errors.token.message
                                : ''}
                            </span>
                          </div>
                        </div>
                      </form>
                    </div>
                  </Fragment>
                )}
                {status === TokenStatus.fail && (
                  <div className={styles['modal-token-container__body--p']}>
                    Es posible que tu token esté desincronizado, para sincronizarlo, ingresa en tu Banca Móvil a la
                    sección “Más” y la opción “Restablecer Token”.
                  </div>
                )}
                {status === TokenStatus.need && (
                  <div className={styles['modal-token-container__body--p']}>
                    Descarga la aplicación de Banco de Bogotá en Google Play Store, App Store o App Gallery y sigue los
                    pasos de activación.
                  </div>
                )}
              </div>
            </div>
          </pulse-modaltc>
        </div>
        <div slot="footer">
          <div className={styles['modal-token-container__footer-btns']}>
            {(status === TokenStatus.basic || status === TokenStatus.wrong) && (
              <div className={styles['modal-token-container__footer-btns__button']}>
                <pulse-button
                  class="modal-token-container__footer-btns__pulse-button"
                  data-testid="token-button-attempt"
                  colorgradient={true}
                  block={true}
                  disabled={!!errors.token || !isDirty}
                  onClick={handleSubmit(fetchAttempt)}
                >
                  Continuar
                </pulse-button>
              </div>
            )}
            {(status === TokenStatus.need || status === TokenStatus.fail) && (
              <div className={styles['modal-token-container__footer-btns__button']}>
                <pulse-button
                  class="modal-token-container__footer-btns__pulse-button"
                  colorgradient={true}
                  block={true}
                  onClick={onClose}
                >
                  Entendido
                </pulse-button>
              </div>
            )}
          </div>
        </div>
      </pulse-modaltb>
    </PulseModalLite>
  );
};

export default ModalToken;
