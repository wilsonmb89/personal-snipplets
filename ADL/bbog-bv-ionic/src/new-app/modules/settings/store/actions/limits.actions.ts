import { Action } from '@ngrx/store';
import { LimitsItem } from '@app/modules/settings/store/states/limits.state';

export const FETCH_ALL_LIMITS = '[Global/API] Preset limits';
export const FETCH_LIMITS_ALL_COMPLETED = '[Global/API] Fetch limits ALL completed';
export const RELOAD_LIMIT = '[Global/API] Reload Limit';
export const RELOAD_LIMIT_COMPLETED = '[Global/API] Reload Limit Completed';
export const REMOVE_LIMITS = '[Global/API] Remove limits';


export class FetchAllLimitsAction implements Action {
  readonly type = FETCH_ALL_LIMITS;

  constructor(public presetData: { accountId: string, accountType: string }[]) {
  }
}

export class FetchLimitsAllCompletedAction implements Action {
  readonly type = FETCH_LIMITS_ALL_COMPLETED;

  constructor(public limits: LimitsItem[]) {
  }
}

export class ReloadLimitAction implements Action {
  readonly type = RELOAD_LIMIT;

  constructor(public accountId: string, public accountType: string) {
  }
}

export class ReloadLimitCompletedAction implements Action {
  readonly type = RELOAD_LIMIT_COMPLETED;

  constructor(public limits: LimitsItem[]) {
  }
}

export class RemoveLimitsAction implements Action {
  readonly type = REMOVE_LIMITS;
}

export type LimitActions =
  RemoveLimitsAction |
  FetchAllLimitsAction |
  FetchLimitsAllCompletedAction |
  ReloadLimitAction |
  ReloadLimitCompletedAction;
