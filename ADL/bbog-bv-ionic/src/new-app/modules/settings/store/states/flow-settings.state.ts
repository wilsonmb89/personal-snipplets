import { CustomerCard } from '../../../../../app/models/activation-cards/customer-cards-list-rs';

export interface SettingsFlowsState {
    debitCardFlowPass: CustomerCard;
    creditCardFlowPass: CustomerCard;
}
