import { CustomerCard } from '../../../../../app/models/activation-cards/customer-cards-list-rs';

export interface CardsInfoState {
  customerCardList: CustomerCard[];
  working: boolean;
  completed: boolean;
  error: any;
}
