import { Action } from '@ngrx/store';

export const ENABLE_LOADING_ACTION = '[Global/UI] Enable Loading';
export const DISABLE_LOADING_ACTION = '[Global/ UI] Disable Loading';


export class EnableLoadingAction implements Action {
    readonly type = ENABLE_LOADING_ACTION;
}

export class DisableLoadingAction implements Action {
    readonly type = DISABLE_LOADING_ACTION;
}

export const EnableLoadingObserverActionsTypes = [];

export const DisableLoadingObserverActionsTypes = [];

export type LoaderActions =
    EnableLoadingAction
    | DisableLoadingAction;
