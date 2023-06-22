import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromBillerInfoList from '../../../new-app/modules/payments/store/actions/billers-payment.action';
import * as fromCCObligationsActions from '../../../new-app/modules/payments/store/actions/cc-obligations.action';
import * as fromFlowChangeKeysActions from '../../../new-app/modules/settings/store/actions/flow-change-keys.action';
import * as fromUserActions from '../../../new-app/shared/store/user/actions/user-settings.action';
import * as fromCardsInfoActions from '../../../new-app/modules/settings/store/actions/cards-info.action';
import * as fromLimitsActions from '@app/modules/settings/store/actions/limits.actions';
import { ProductsResetAction } from '@app/shared/store/products/actions/products.action';
import * as fromACObligationsActions from '../../../new-app/modules/payments/store/actions/ac-obligations.action';
import * as fromCreditCardsActions from '../../../new-app/shared/store/products/actions/credit-card.action';

@Injectable()
export class ClearStateFacade {

    constructor(private store: Store<any>) { }

    public logoutState(): void {
        this.store.dispatch(new fromCCObligationsActions.RemoveCCObligationsAction());
        this.store.dispatch(new fromBillerInfoList.RemoveBillersPaymentAction());
        this.store.dispatch(new fromUserActions.UserResetAction());
        this.store.dispatch(new fromFlowChangeKeysActions.FlowChangeKeysResetAction());
        this.store.dispatch(new ProductsResetAction());
        this.store.dispatch(new fromUserActions.UserFeaturesRemoveAction());
        this.store.dispatch(new fromCardsInfoActions.RemoveCardsInfoAction());
        this.store.dispatch(new fromACObligationsActions.RemoveACObligationsAction());
        this.store.dispatch(new fromCreditCardsActions.CardsToActivateShowAction());
        this.store.dispatch(new fromLimitsActions.RemoveLimitsAction());
    }

}
