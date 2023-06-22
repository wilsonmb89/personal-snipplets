import { AxiosResponse } from 'axios';

import { axiosADLInstance } from '@utils/constants';
import { GetCardsRq, GetCardsRs } from './cards-info.entity';

export const fetchCardsInfoApi = (request: GetCardsRq): Promise<GetCardsRs> => {
  return axiosADLInstance
    .post<GetCardsRq, AxiosResponse<GetCardsRs>>('products/v2/cards', request)
    .then(response => response.data);
};
