import { Action } from '@ngrx/store';
import { CdtRenewalResponse } from '@app/modules/products/models/cdt-renewal-response';
import { CdtRenewalRequest } from '@app/modules/products/models/cdt-renewal-request';
import { DisableLoadingObserverActionsTypes, EnableLoadingObserverActionsTypes } from '../../loader/actions/loader.action';

export const SET_DIGITAL_CDT_RENEWAL = '[Products/API] Digital CDT renewal';
export const SET_DIGITAL_CDT_RENEWAL_SUCCESS = '[Products/API] Digital CDT renewal success';
export const SET_DIGITAL_CDT_RENEWAL_ERROR = '[Products/API] Digital CDT renewal error';


export class SetDigitalCdtRenewalAction implements Action {
    readonly type = SET_DIGITAL_CDT_RENEWAL;

    constructor(public cdtRenewalRequest: CdtRenewalRequest) {}
  }

export class SetDigitalCdtRenewalSuccessAction implements Action {
  readonly type = SET_DIGITAL_CDT_RENEWAL_SUCCESS;

  constructor(public cdtRenewalResponse: CdtRenewalResponse) {}
}

export class SetDigitalCdtRenewalErrorAction implements Action {
    readonly type = SET_DIGITAL_CDT_RENEWAL_ERROR;
  }

export type DigitalCdtRenewalActions =
  SetDigitalCdtRenewalAction
  | SetDigitalCdtRenewalSuccessAction
  | SetDigitalCdtRenewalErrorAction;

// Add action to enable loading
EnableLoadingObserverActionsTypes.push(SET_DIGITAL_CDT_RENEWAL);

// Add action to disable loading
DisableLoadingObserverActionsTypes.push(SET_DIGITAL_CDT_RENEWAL_SUCCESS);
DisableLoadingObserverActionsTypes.push(SET_DIGITAL_CDT_RENEWAL_ERROR);
