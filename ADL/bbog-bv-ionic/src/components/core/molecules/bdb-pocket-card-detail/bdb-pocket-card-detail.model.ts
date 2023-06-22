import { ProductDetail } from '../../../../app/models/products/product-model';

export interface BdbPocketCardDetailModel {
  pocketBalance: string | number;
  pocketGoal: string | number;
  pocketName: string;
  pocketId: string;
  logo?: string;
  cardOptions?: PocketCardOptions;
  cardButton?: PocketCardButton[];
  product?: ProductDetail;
}

export interface PocketCardButton {
  text?: string;
  icon?: any;
  id: string;
  action?: (parameter: any) => void;
}

/**
 * Do not use columns attribute if
 * a special set up is not needed
 */
export interface PocketCardOptions {
  columns?: number;
  color: string;
  colorVariant?: string;
  colorGradient?: boolean;
  backgroundImg: string;
  showError: boolean;
  msgError: string;
}

export interface PocketCardHeader {
  title: string;
  subtitle: string;
}
