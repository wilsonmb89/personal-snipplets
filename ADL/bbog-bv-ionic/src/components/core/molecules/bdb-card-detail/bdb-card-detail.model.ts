import { ProductDetail } from '../../../../app/models/products/product-model';

export interface BdbCardDetailModel {
  cardHeader?: CardHeader;
  firstColData?: any;
  dataToShow?: any[];
  logo?: string;
  cardOptions?: CardOptions;
  cardButton?: CardButton[];
  product?: ProductDetail;
}

export interface CardButton {
  text?: string;
  icon?: any;
  id: string;
  disbled?: boolean;
  action?: (parameter: any) => void;
}

/**
 * Do not use columns attribute if
 * a special set up is not needed
 */
export interface CardOptions {
  columns?: number;
  color: string;
  colorVariant?: string;
  colorGradient?: boolean;
  backgroundImg: string;
  showError: boolean;
  msgError: string;
}

export interface CardHeader {
  title: string;
  subtitle: string;
}
