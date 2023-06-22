import {BdbMap} from '../bdb-generics/bdb-map';
import { ApiProductDetail } from '../../../new-app/core/services-apis/products/products/models/products';


export class ProductDetail {
  public productBank: string;
  public bankId: string;
  public isAval: boolean;
  public productName: string;
  public productType: string;
  public productNumber: string;
  public productNumberX: string;
  public description: string;
  public amount: any;
  public isActive: boolean;
  public productNumberApi?: string;
  public favorite?: boolean;
  public favoriteTime?: number;
  public balanceDetail?: any;
  public franchise?: string;
  public category?: string;
  public disinvest?: boolean;
  public openDt?: string;
  public productTypeBDB?: string;
  public productDetailApi?: ApiProductDetail;
  public hasAdvancePmnt?: boolean;

  constructor() {
  }
}

export function mapDetailsBalance(details: Array<BdbMap>) {
  const cc: any = {};
  details.forEach(m => {
    cc[m.key] = m.value || '';
  });
  return cc;
}
