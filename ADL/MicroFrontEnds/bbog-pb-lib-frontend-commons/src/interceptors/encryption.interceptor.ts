import { AxiosInstance, AxiosRequestConfig } from 'axios';
import responseHandlers from './response-handlers';
import { PublicKeyData } from '../modules/public-key.model';
import { intercept as networkIntercept } from '../modules/encryption';

const notEncryptedURLs = ['setup/start'];

export const createEncryptionInterceptor = (
  isEncrypted: boolean,
  encryptionData: PublicKeyData,
  axiosInstance: AxiosInstance
): { destroyInterceptor: () => void } => {
  const intercept = (config: AxiosRequestConfig) => {
    config.validateStatus = status => status < 500;

    if (!isEncrypted || notEncryptedURLs.includes(config.url as string)) {
      return config;
    }
    const req = { body: config.data, headers: {} };
    const { body: data, headers, decryptBody } = networkIntercept({ encryptionData, request: req });

    // TODO: remove this workaround when body quotes wont be a problem anymore
    config.transformRequest = data => data;
    config.transformResponse = response => {
      if (!isEncrypted || notEncryptedURLs.includes(config.url as string)) {
        return response;
      }
      const decryptedData = decryptBody(response);
      return decryptedData;
    };
    return { ...config, data, headers };
  };

  const requestInterceptor = axiosInstance.interceptors.request.use(intercept);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseInterceptor = axiosInstance.interceptors.response.use(...(responseHandlers as any));

  const destroyInterceptor = () => {
    axiosInstance.interceptors.request.eject(requestInterceptor);
    axiosInstance.interceptors.response.eject(responseInterceptor);
  };

  return { destroyInterceptor };
};
