import { AxiosResponse, AxiosInstance } from 'axios';
import { decrypt, encrypt } from './encryption';
import { PublicKeyData } from './public-key.model';

const PUBLIC_KEY = 'PublicKeyState';

export const publicKeyApi = (axiosInstance: AxiosInstance): Promise<{ publicKey: string; diffTime: number }> => {
  return axiosInstance.post<never, AxiosResponse<string>>(`setup/start`).then(({ headers, data }) => ({
    publicKey: data,
    diffTime: ((headers['last-modified'] as unknown) as number) - new Date().getTime()
  }));
};

export const getPublicKeyConfig = async (axiosInstance: AxiosInstance): Promise<PublicKeyData> => {
  const encryptedPublicKeyData = sessionStorage.getItem(btoa(PUBLIC_KEY));

  if (encryptedPublicKeyData) {
    const publicKeyData = decrypt(encryptedPublicKeyData) as unknown;
    return publicKeyData as PublicKeyData;
  }
  const publicKeyData = await publicKeyApi(axiosInstance);
  sessionStorage.setItem(btoa(PUBLIC_KEY), encrypt(publicKeyData));

  return publicKeyData;
};
