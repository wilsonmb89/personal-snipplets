import { BillersPaymentState } from '../../../new-app/modules/payments/store/states/payment-core.state';
import { CCObligationsState } from '../../../new-app/modules/payments/store/states/cc-obligations.state';
import { CardsInfoState } from '../../../new-app/modules/settings/store/states/cards-info.state';
import { SettingsFlowsState } from '../../../new-app/modules/settings/store/states/flow-settings.state';
import { UserState } from '../../../new-app/shared/store/user/states/user.state';
import { ProductsState } from '@app/shared/store/products/states/products.state';
import { CreditCardState } from '@app/shared/store/products/states/credit-card.state';
import { AcObligationsState } from '../../../new-app/modules/payments/store/states/ac-obligations.state';
import { LimitsState } from '@app/modules/settings/store/states/limits.state';
import {AuthenticationState} from '@app/modules/authentication/store/states/auth.state';

export interface AppState {
    billersPaymentState: BillersPaymentState;
    ccObligationsState: CCObligationsState;
    acObligationsState: AcObligationsState;
    cardsInfoState: CardsInfoState;
    userState: UserState;
    settingsFlowsState: SettingsFlowsState;
    productsState: ProductsState;
    limitsState: LimitsState;
    creditCardState: CreditCardState;
    authState: AuthenticationState;
}
