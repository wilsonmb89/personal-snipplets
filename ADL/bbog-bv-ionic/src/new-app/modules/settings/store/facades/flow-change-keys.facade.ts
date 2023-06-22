import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SettingsFlowsState } from '../states/flow-settings.state';

import * as fromFlowChangeKeysSelector from '../selectors/flow-change-keys.selector';
import * as fromFlowChangeKeysAction from '../actions/flow-change-keys.action';
import { CustomerCard } from '../../../../../app/models/activation-cards/customer-cards-list-rs';

@Injectable()
export class FlowChangeKeysFacade {

    debitCardFlowPass$: Observable<CustomerCard> = this.store.select(fromFlowChangeKeysSelector.getDebitCardFlowPass);
    creditCardFlowPass$: Observable<CustomerCard> = this.store.select(fromFlowChangeKeysSelector.getCreditCardFlowPass);

    constructor(private store: Store<SettingsFlowsState>) { }

    public setDebitCardFlowPass(debitCard: CustomerCard): void {
        this.store.dispatch(new fromFlowChangeKeysAction.SetDebitCardAction(debitCard));
    }

    public resetDebitCardFlowPass(): void {
        this.store.dispatch(new fromFlowChangeKeysAction.FlowChangeKeysResetAction());
    }

    public setCreditCardFlowPass(creditCard: CustomerCard): void {
        this.store.dispatch(new fromFlowChangeKeysAction.SetCreditCardAction(creditCard));
    }

}
