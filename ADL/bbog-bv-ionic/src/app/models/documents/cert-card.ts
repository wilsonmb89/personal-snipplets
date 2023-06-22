import { ProductDetail } from 'app/models/products/product-model';

export interface CertCard {
  cardTitle: string;
  cardLabel: string;
  cardIcon: string;
  isActive: boolean;
  product: ProductDetail;
  typeNemo: string;
}
