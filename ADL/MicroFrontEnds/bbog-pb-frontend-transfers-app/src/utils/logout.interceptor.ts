import { AxiosInstance } from 'axios';

export const createLogoutInterceptor = (
  axiosInstance: AxiosInstance,
  navigate: (route: string) => void
): { destroy: () => void } => {
  const interceptorResponse = axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.status === 401) {
        navigate('/logout');
      }
      return Promise.reject(error);
    }
  );
  const destroy = () => {
    axiosInstance.interceptors.response.eject(interceptorResponse);
  };

  return { destroy };
};
