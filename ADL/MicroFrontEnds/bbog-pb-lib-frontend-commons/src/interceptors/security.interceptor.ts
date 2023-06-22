import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginResponse } from '../auth/login.model';
import { decrypt } from '../modules/encryption';

const validateNotAuthenticatedUrl = (url: string): boolean => {
  return url === 'setup/start';
};

export const createSecurityInterceptor = (axiosInstance: AxiosInstance): { destroyInterceptor: () => void } => {
  const intercept = (config: AxiosRequestConfig) => {
    let accessToken = null;

    if (!validateNotAuthenticatedUrl(config.url as string)) {
      const encryptedSessionData = sessionStorage.getItem(btoa('AuthState'));
      const authCredentials = encryptedSessionData
        ? ((decrypt(encryptedSessionData) as unknown) as LoginResponse)
        : null;
      if (authCredentials) {
        accessToken = authCredentials.accessToken;
      }
    }

    const headers = {
      ...config.headers,
      channel: 'PB',
      Authorization: accessToken,
      'Content-Type': 'application/json',
      'X-Version': '2'
    };
    return { ...config, headers };
  };

  const interceptorRequest = axiosInstance.interceptors.request.use(intercept);
  const interceptorResponse = axiosInstance.interceptors.response.use(
    response => response,
    error => {
      return Promise.reject(error);
    }
  );
  const destroyInterceptor = () => {
    axiosInstance.interceptors.request.eject(interceptorRequest);
    axiosInstance.interceptors.response.eject(interceptorResponse);
  };

  return { destroyInterceptor };
};
