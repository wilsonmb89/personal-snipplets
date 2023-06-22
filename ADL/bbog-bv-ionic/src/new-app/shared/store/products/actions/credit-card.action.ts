import { Action } from '@ngrx/store';
import { EnableLoadingObserverActionsTypes, DisableLoadingObserverActionsTypes } from '../../loader/actions/loader.action';
import { CreditCardAccountInfoRq, CreditCardAccountInfoRs } from '@app/apis/customer-security/models/creditCardAccountInfo';
import { CreditCardActivationRq, CreditCardActivationRs } from '@app/apis/customer-security/models/creditCardActivation';
import { CreditCardBlockRq, CreditCardBlockRs } from '@app/apis/customer-security/models/creditCardBlock';
import { CreditCardUnblockRq, CreditCardUnblockRs } from '@app/apis/customer-security/models/creditCardUnblock';

// Account Info Actions
export const CARD_ACCOUNT_INFO = '[CustomerSecurity/API] Credit Card Account Info';
export const CARD_ACCOUNT_INFO_SUCCESS = '[CustomerSecurity/API] Credit Card Account Info Success';
export const CARD_ACCOUNT_INFO_ERROR = '[CustomerSecurity/API] Credit Card Account Info Error';

export class CardAccountInfoAction implements Action {
  readonly type = CARD_ACCOUNT_INFO;
  constructor(public creditCardAccountInfoRq: CreditCardAccountInfoRq) {}
}

export class CardAccountInfoSuccessAction implements Action {
  readonly type = CARD_ACCOUNT_INFO_SUCCESS;
  constructor(public creditCardAccountInfoRs: CreditCardAccountInfoRs) {}
}

export class CardAccountInfoErrorAction implements Action {
  readonly type = CARD_ACCOUNT_INFO_ERROR;
  constructor(public errorResponse: any) {}
}

// Activation Actions
export const CARD_ACTIVATION = '[CustomerSecuriry/API] Credit Card Activation';
export const CARD_ACTIVATION_SUCCESS = '[CustomerSecuriry/API] Credit Card Activation Success';
export const CARD_ACTIVATION_ERROR = '[CustomerSecuriry/API] Credit Card Activation Error';

export class CardActivationAction implements Action {
  readonly type = CARD_ACTIVATION;
  constructor(public creditCardActivationRq: CreditCardActivationRq) {}
}

export class CardActivationSuccessAction implements Action {
  readonly type = CARD_ACTIVATION_SUCCESS;
  constructor(public creditCardActivationRs: CreditCardActivationRs) {}
}

export class CardActivationErrorAction implements Action {
  readonly type = CARD_ACTIVATION_ERROR;
  constructor(public errorResponse: any) {}
}

// Block Actions
export const CARD_BLOCKING = '[CustomerSecurity/API] Credit Card Blocking';
export const CARD_BLOCKING_SUCCESS = '[CustomerSecurity/API] Credit Card Blocking Success';
export const CARD_BLOCKING_ERROR = '[CustomerSecurity/API] Credit Card Blocking Error';

export class CardBlockAction implements Action {
  readonly type = CARD_BLOCKING;
  constructor(public creditCardBlockRq: CreditCardBlockRq) {}
}

export class CardBlockSuccessAction implements Action {
  readonly type = CARD_BLOCKING_SUCCESS;
  constructor(public creditCardBlockRs: CreditCardBlockRs) {}
}

export class CardBlockErrorAction implements Action {
  readonly type = CARD_BLOCKING_ERROR;
  constructor(public errorResponse: any) {}
}

// Unblock Actions
export const CARD_UNBLOCK = '[CustomerSecurity/API] Credit Card Unlocking';
export const CARD_UNBLOCK_SUCCESS = '[CustomerSecurity/API] Credit Card Unlocking Success';
export const CARD_UNBLOCK_ERROR = '[CustomerSecurity/API] Credit Card Unlocking Error';

export class CardUnblockAction implements Action {
  readonly type = CARD_UNBLOCK;
  constructor(public creditCardUnblockRq: CreditCardUnblockRq) {}

}
export class CardUnblockSuccessAction implements Action {
  readonly type = CARD_UNBLOCK_SUCCESS;
  constructor(public creditCardUnblockRs: CreditCardUnblockRs) {}
}

export class CardUnblockErrorAction implements Action {
  readonly type = CARD_UNBLOCK_ERROR;
  constructor(public errorResponse: any) {}
}

// Show Credit Card Activate Actions
export const CARDS_TO_ACTIVATE_HIDDEN = '[CustomerSecurity/API] Credit Cards to Activate Hidden';
export const CARDS_TO_ACTIVATE_SHOW = '[CustomerSecurity/API] Credit Cards to Activate Show';

export class CardsToActivateHiddenAction implements Action {
  readonly type = CARDS_TO_ACTIVATE_HIDDEN;
}

export class CardsToActivateShowAction implements Action {
  readonly type = CARDS_TO_ACTIVATE_SHOW;
}

// Reset Credit Card Action
export const CREDIT_CARD_RESET = '[CustomerSecurity/API] Credit card reset';

export class CreditCardResetAction implements Action {
  readonly type = CREDIT_CARD_RESET;
}

// Show tooltip to asing key to TC Actions
export const TOOLTIP_KEY_SHOW = '[CustomerSecurity/API] Show Tooltipt o TC key';
export const TOOLTIP_KEY_HIDDEN = '[CustomerSecurity/API] Hidden Tooltipt o TC key';
export class RemeberKeyTooltipShowAction implements Action {
  readonly type = TOOLTIP_KEY_SHOW;
}
export class RemeberKeyTooltipHiddenAction implements Action {
  readonly type = TOOLTIP_KEY_HIDDEN;
}

export type CreditCardActions =
  | CardAccountInfoAction
  | CardAccountInfoSuccessAction
  | CardAccountInfoErrorAction
  | CardActivationAction
  | CardActivationSuccessAction
  | CardActivationErrorAction
  | CardBlockAction
  | CardBlockSuccessAction
  | CardBlockErrorAction
  | CardUnblockAction
  | CardUnblockSuccessAction
  | CardUnblockErrorAction
  | CardsToActivateHiddenAction
  | CardsToActivateShowAction
  | RemeberKeyTooltipShowAction
  | RemeberKeyTooltipHiddenAction
  | CreditCardResetAction;

// Add action to enable loading
EnableLoadingObserverActionsTypes.push(CARD_ACTIVATION);
EnableLoadingObserverActionsTypes.push(CARD_ACCOUNT_INFO);
EnableLoadingObserverActionsTypes.push(CARD_BLOCKING);
EnableLoadingObserverActionsTypes.push(CARD_UNBLOCK);

// Add action to disable loading
DisableLoadingObserverActionsTypes.push(CARD_ACTIVATION_SUCCESS);
DisableLoadingObserverActionsTypes.push(CARD_ACTIVATION_ERROR);
DisableLoadingObserverActionsTypes.push(CARD_ACCOUNT_INFO_SUCCESS);
DisableLoadingObserverActionsTypes.push(CARD_ACCOUNT_INFO_ERROR);
DisableLoadingObserverActionsTypes.push(CARD_BLOCKING_SUCCESS);
DisableLoadingObserverActionsTypes.push(CARD_BLOCKING_ERROR);
DisableLoadingObserverActionsTypes.push(CARD_UNBLOCK_SUCCESS);
DisableLoadingObserverActionsTypes.push(CARD_UNBLOCK_ERROR);
