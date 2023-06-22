import { encrypt } from '../modules/encryption';
import { AppError, BusinessErrorCodes } from '../interceptors/response-handlers';
import { login } from './login';
import { LoginConfig, LoginCredentials, LoginOptions } from './login.model';

export const promptLogin = async (config: LoginConfig, recaptchaToken: string): Promise<void> => {
  const identificationType = prompt('Tipo de identificación:', 'CC');
  const identificationNumber = identificationType && prompt('Número de identificación:', '2006730');
  const password = identificationNumber && prompt('Clave:', '1234');

  if (identificationNumber && identificationType && password) {
    const credentials = {
      password,
      identificationType,
      identificationNumber
    };

    try {
      const loginCredentials = await login(config, credentials, { recaptchaToken });
      sessionStorage.setItem(btoa('AuthState'), encrypt(loginCredentials));
    } catch (loginError) {
      try {
        await promptLoginWithToken(config, credentials, recaptchaToken, loginError as AppError);
      } catch (error) {
        const repeatLogin = confirm('Error al hacer login, deseas hacer login de nuevo?');
        if (repeatLogin) {
          promptLogin(config, recaptchaToken);
        }
      }
    }
  } else {
    throw 'Por favor ingresa los datos de ingreso del usuario';
  }
};

export const promptLoginWithToken = async (
  config: LoginConfig,
  credentials: LoginCredentials,
  recaptchaToken: string,
  error: AppError
): Promise<void> => {
  const errorDetail = error.data;
  if (errorDetail?.businessErrorCode === BusinessErrorCodes.Challenge) {
    const options: LoginOptions = {
      mobileToken: prompt('Token:', '') || undefined,
      tokenCookie: errorDetail.customDetails.rsaRetryCorrelationId,
      recaptchaToken
    };
    try {
      const loginCredentials = await login(config, credentials, options);
      sessionStorage.setItem(btoa('AuthState'), encrypt(loginCredentials));
    } catch (e) {
      const loginError = e as AppError;
      return await promptLoginWithToken(config, credentials, recaptchaToken, loginError);
    }
  } else {
    return Promise.reject(error);
  }
};
