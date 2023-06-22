import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './states/app.state';
import { billerInfoListReducer } from '../../new-app/modules/payments/store/reducers/billers-payment.reducer';
import { ccObligationsReducer } from '../../new-app/modules/payments/store/reducers/cc-obligations.reducer';
import { accountListListReducer } from '../../new-app/modules/settings/store/reducers/card-info.reducer';
import { flowChangeKeysReducer } from '../../new-app/modules/settings/store/reducers/flow-change-keys.reducer';
import { userReducer } from '../../new-app/shared/store/user/reducers/user.reducer';
import { productsReducer } from '@app/shared/store/products/reducers/products.reducer';
import { creditCardReducer } from '@app/shared/store/products/reducers/credit-card.reducer';
import { acObligationsReducer } from '../../new-app/modules/payments/store/reducers/ac-obligations.reducer';
import { LimitsReducer } from '@app/modules/settings/store/reducers/limits.reducer';
import {authReducer} from '@app/modules/authentication/store/reducers/auth.reducer';

export const appReducers: ActionReducerMap<AppState> = {
    billersPaymentState: billerInfoListReducer,
    ccObligationsState: ccObligationsReducer,
    cardsInfoState: accountListListReducer,
    userState: userReducer,
    settingsFlowsState: flowChangeKeysReducer,
    productsState: productsReducer,
    acObligationsState: acObligationsReducer,
    creditCardState: creditCardReducer,
    limitsState: LimitsReducer,
    authState: authReducer
};
