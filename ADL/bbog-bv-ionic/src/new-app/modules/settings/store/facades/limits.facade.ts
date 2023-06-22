import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LimitsItem, LimitsState } from '@app/modules/settings/store/states/limits.state';
import * as limitActions from '@app/modules/settings/store/actions/limits.actions';
import * as limitsSelector from '@app/modules/settings/store/selectors/limits.selector';
import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operators';

@Injectable()
export class LimitsFacade {

  getAllLimits$: Observable<LimitsItem[]> = this.store.select(limitsSelector.getLimits);

  constructor(private store: Store<LimitsState>) {
  }

  public fetchLimits(data: { accountId: string, accountType: string }[]): void {
    this.store.dispatch(new limitActions.FetchAllLimitsAction(data));
  }

  public reloadLimit(accountId: string, accountType: string): void {
    this.store.dispatch(new limitActions.ReloadLimitAction(accountId, accountType));
  }

  public clearLimits(): void {
    this.store.dispatch(new limitActions.RemoveLimitsAction());
  }

  public getLimitByAccountId(accountId: string): Observable<LimitsItem> {
    return this.getAllLimits$.pipe(map(limit => {
      if (!!limit) {
        return limit.find(i => i.accountId === accountId);
      }

    }));
  }


}
