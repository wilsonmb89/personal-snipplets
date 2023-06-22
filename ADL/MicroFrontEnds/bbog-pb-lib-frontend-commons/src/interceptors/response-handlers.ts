import { AxiosError, AxiosResponse } from 'axios';

export interface AppError extends Error {
  type: string;
  status?: number;
  data?: BusinessError;
}

export enum BusinessErrorCodes {
  DuplicatedTransaction = 'DUPLICATED_TRANSACTION',
  Timeout = 'TIMEOUT',
  DataDoesNotExist = 'DATA_NOT_EXIST',
  Challenge = 'CHALLENGE',
  RecaptchaRobot = 'RECAPTCHA_ROBOT',
  TokenBlocked = 'TOKEN_VALIDATION_ATTEMPTS_EXCEEDED'
}

export enum BusinessErrorMessages {
  InvalidToken = 'Validacion de Token No Exitosa',
  UserBlockedUniversalKey = 'Clave segura bloqueada',
  UserBlockedDebitCardPin = 'The debitcard is blocked'
}

export interface BusinessError {
  businessErrorCode: BusinessErrorCodes;
  backendErrorMessage: BusinessErrorMessages;
  customDetails: Record<string, string>;
}

export type AdlResponse = AxiosResponse<{
  customerErrorMessage?: {
    title: string;
    message: string;
  };
}>;

const responseHandlers = [
  (response: AdlResponse): Promise<AppError> | AdlResponse => {
    switch (response.status) {
      case 401:
        return Promise.reject({
          type: 'error',
          name: 'Sesión finalizada',
          message: 'La sesión ha expirado.',
          status: 401
        });
      case 409:
        return Promise.reject({
          type: 'error',
          name: response.data.customerErrorMessage?.title,
          message: response.data.customerErrorMessage?.message,
          status: response.status,
          data: response
        });
    }
    return response;
  },
  (errorResponse: AxiosError): Promise<AppError> => {
    if (!errorResponse.toJSON) {
      return Promise.reject(errorResponse);
    }

    const error = errorResponse.toJSON() as AppError;
    if (error.message === 'Network Error') {
      return Promise.reject({
        type: 'error',
        name: 'Error en la carga',
        message: 'Ha fallado la carga de información. Por favor vuelve a intentar.',
        status: 0
      });
    }

    if (error.status && error.status >= 500) {
      return Promise.reject({
        type: 'error',
        name: 'Algo ha fallado',
        message: 'En estos momentos no podemos hacer la transacción. Por favor inténtalo nuevamente más tarde.',
        status: error.status
      });
    }

    return Promise.reject(error);
  }
];

export default responseHandlers;
