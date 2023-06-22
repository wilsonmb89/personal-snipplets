import { ProductDetail } from '../../../../app/models/products/product-model';
import { InvoiceInfoDetail } from '../../../core/services-apis/payment-billers/models/payment-billers-api.model';

export class DianTaxInfo {
  taxInfo: TaxInfo;
  taxInfoDetail: InvoiceInfoDetail;
  accountOrigin: ProductDetail;
}

export class TaxInfo {
  taxCode: string;
  taxName: string;
  invoiceNum: string;
}
