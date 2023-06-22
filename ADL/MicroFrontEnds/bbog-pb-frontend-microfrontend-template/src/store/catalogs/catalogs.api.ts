import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';
import { CatalogData, GetCatalogRq } from './catalogs.entity';

export const fetchCatalogApi = (getCatalogRq: GetCatalogRq): Promise<CatalogData[]> => {
  return axiosADLInstance
    .post<GetCatalogRq, AxiosResponse<{ catalogItems: CatalogData[] }>>('user-features/get-catalog', getCatalogRq)
    .then(response => response.data.catalogItems);
};
