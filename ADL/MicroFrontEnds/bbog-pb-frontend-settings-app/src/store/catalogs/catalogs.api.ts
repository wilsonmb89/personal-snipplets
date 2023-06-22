import { axiosADLInstance } from '@utils/constants';
import { AxiosResponse } from 'axios';
import { CatalogData, GetCatalogRq } from './catalogs.entity';

export const fetchCatalogsApi = (catalogRequest: GetCatalogRq): Promise<CatalogData[]> => {
  return axiosADLInstance
    .post<GetCatalogRq, AxiosResponse<{ catalogItems: CatalogData[] }>>('/user-features/get-catalog', catalogRequest)
    .then(response => {
      return response.data.catalogItems;
    });
};
