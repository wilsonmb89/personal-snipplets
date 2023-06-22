import { createEncryptionInterceptor } from './encryption.interceptor';
import { createSecurityInterceptor } from './security.interceptor';
import { getPublicKeyConfig } from '../modules/public-key';
import { AxiosInstance } from 'axios';

export interface CreateInterceptors {
  destroy: () => void;
}

export const createInterceptors = async (
  isEncrypted: boolean,
  axiosInstance: AxiosInstance
): Promise<CreateInterceptors> => {
  const publicKeyData = await getPublicKeyConfig(axiosInstance);
  const securityInterceptor = createSecurityInterceptor(axiosInstance);
  const encryptionInterceptor = createEncryptionInterceptor(isEncrypted, publicKeyData, axiosInstance);

  const destroy = () => {
    securityInterceptor.destroyInterceptor();
    encryptionInterceptor?.destroyInterceptor();
  };
  return { destroy };
};
