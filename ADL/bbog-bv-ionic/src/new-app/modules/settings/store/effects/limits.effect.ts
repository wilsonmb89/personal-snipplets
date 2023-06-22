import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import * as limitActions from '@app/modules/settings/store/actions/limits.actions';
import { Actions, Effect } from '@ngrx/effects';
import { CustomerSecurityService } from '@app/apis/customer-security/customer-security.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { LimitsFacade } from '@app/modules/settings/store/facades/limits.facade';
import { catchError, map, withLatestFrom } from 'rxjs/operators';
import { LimitsItem } from '@app/modules/settings/store/states/limits.state';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { LimitInformationNatAccRq } from '@app/apis/customer-security/models/limitInformationNatAcc.model';
import { forkJoin } from 'rxjs/observable/forkJoin';


@Injectable()
export class LimitsEffect {

  constructor(
    private actions$: Actions,
    private store: Store<ListeningState>,
    private customerSecurityService: CustomerSecurityService,
    private limitsFacade: LimitsFacade
  ) {
  }

  @Effect()
  fetchLimitsALL$: Observable<Action> = this.actions$
    .ofType(limitActions.FETCH_ALL_LIMITS)
    .concatMap((action: limitActions.FetchAllLimitsAction) => of(action).pipe())
    .mergeMap((action) => {
      const limitsObs: Observable<LimitsItem>[] = [];
      action.presetData.forEach(limitPreset => {
        limitsObs.push(this.findLimits(limitPreset.accountId, limitPreset.accountType));
      });

      return combineLatest(limitsObs).pipe(map(limits => {
        return new limitActions.FetchLimitsAllCompletedAction(limits);
      }));

    });


  @Effect()
  reloadLimit$: Observable<Action> = this.actions$
    .ofType(limitActions.RELOAD_LIMIT)
    .concatMap((action: limitActions.ReloadLimitAction) => of(action).pipe(
      withLatestFrom(
        this.limitsFacade.getAllLimits$)
    )).mergeMap(([action, limitsInState]) => {

      return this.findLimits(action.accountId, action.accountType).pipe(map(newLimit => {
        const limitsInStateFiltered = limitsInState.filter(v => !(v.accountId === action.accountId));
        limitsInStateFiltered.push(newLimit);
        return new limitActions.ReloadLimitCompletedAction(limitsInStateFiltered);
      }));

    });


  private findLimits(accountId: string, accountType: string): Observable<LimitsItem> {
    return forkJoin(
      this.customerSecurityService.limitInformation({acctId: accountId, acctType: accountType}),
      this.customerSecurityService.limitInformationNatAcc(this.buildLimitInformationRq(accountId, accountType))
    ).pipe(map(([limits, accountLimit]) => {
        return {
          limits: limits.bankLimit,
          accountId: accountId,
          complete: true,
          working: false,
          error: null,
          accountType: accountType,
          natAccountLimit: accountLimit.bankLimit[0]
        };
      }),
      catchError(err => {
        return of({
          limits: null,
          accountId: accountId,
          complete: false,
          working: false,
          error: err,
          accountType: accountType,
          natAccountLimit: null
        });
      }));
  }


  private buildLimitInformationRq(accountId: string, accountType: string): LimitInformationNatAccRq {
    const request: LimitInformationNatAccRq = {
      acctId: accountId,
      acctType: accountType
    };
    return request;
  }


}
