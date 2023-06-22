import * as userSettingsActions from '../actions/user-settings.action';
import * as userSettingsSelector from '../selectors/user.selector';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, first, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { SecurityApiService } from '../../../../core/services-apis/app-core/security/security-api.service';
import { ValidationApiService } from '../../../../core/services-apis/identity-validation/validation-api.service';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BdbCypherService } from '@app/shared/utils/bdb-cypher-service/bdb-cypher.service';
import { UserState } from '../states/user.state';
import { basicDataSelector } from '../selectors/user.selector';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { CustomerBasicDataService } from '@app/apis/customer-basic-data/customer-basic-data.service';
import { BasicDataRs } from '@app/apis/customer-basic-data/models/getBasicData.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { BdbCryptoForgeProvider } from '../../../../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbInMemoryProvider } from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../../providers/storage/in-memory.keys';
import { NewLoginResponse } from '@app/apis/authenticator/models/authenticator.model';

@Injectable()
export class UserSettingsEffects {
  @Effect()
  publicKeyEffect$: Observable<Action> = this.actions$
    .ofType(userSettingsActions.USER_PUBLIC_KEY)
    .pipe(
      switchMap((_) => {
          const publicKeyState = sessionStorage.getItem(btoa('PublicKeyState'));
          if (publicKeyState) {
            const {publicKey, diffTime} = this.bdbCryptoForgeProvider.decrypt(publicKeyState);
            return of({
              type: userSettingsActions.USER_PUBLIC_KEY_SUCCESS,
              publicKey,
              diffTime,
            });
          }
          return this.securityApiService.getPublicKey().pipe(
            map(({ publicKey, diffTime }) => ({
              type: userSettingsActions.USER_PUBLIC_KEY_SUCCESS,
              publicKey,
              diffTime,
            })),
            catchError((error) => of({ type: userSettingsActions.USER_PUBLIC_KEY_ERROR }))
          );
        }
      )
    );

  @Effect({ dispatch: false })
  publicKeySuccessEffect$: Observable<Action> = this.actions$
    .ofType(userSettingsActions.USER_PUBLIC_KEY_SUCCESS)
    .pipe(
      tap(data => {
        sessionStorage.setItem(btoa('PublicKeyState'), this.bdbCryptoForgeProvider.encrypt(data));
      })
    );

  @Effect()
  basicDataEffect$: Observable<Action> = this.actions$
    .ofType(userSettingsActions.USER_BASIC_DATA)
    .pipe(
      switchMap((_) => this.store.select(basicDataSelector).pipe(first())),
      mergeMap((basicData) =>
        !!basicData
          ? of({ type: userSettingsActions.USER_BASIC_DATA_SUCCESS, basicData })
          : this.fetchBasicData()
      )
    );

  @Effect()
  refreshBasicDataEffect$: Observable<Action> = this.actions$
    .ofType(userSettingsActions.USER_BASIC_DATA_REFRESH)
    .pipe(mergeMap((_) => this.refreshBasicData()));

  @Effect()
  fetchUserFeaturesEffect$: Observable<Action> = this.actions$
    .ofType(userSettingsActions.USER_FEATURES_DATA)
    .concatMap(action => of(action).pipe(
      withLatestFrom(
        this.store.select(userSettingsSelector.userFeaturesDataSelector),
        this.store.select(userSettingsSelector.userFeaturesCompletedSelector)
      )
    ))
    .mergeMap(([state, userFeatures, complete]) => {
      if (complete) {
        return of(({
          type: userSettingsActions.USER_FEATURES_SUCCESS,
          userFeatures: userFeatures
        }));
      }
      return this.userFeaturesService.getUserFeatures().pipe(
        map(
          res => ({
            type: userSettingsActions.USER_FEATURES_SUCCESS,
            userFeatures: res
          })
        ),
        catchError((err: any) => of({
          type: userSettingsActions.USER_FEATURES_ERROR,
          error: err
        }))
      );
    });

  @Effect()
  updateUserFeaturesEffect$: Observable<Action> = this.actions$
    .ofType<userSettingsActions.UserFeaturesUpdateAction>(userSettingsActions.USER_FEATURES_UPDATE)
    .mergeMap(
      (action) => {
        return this.userFeaturesService.saveUserFeatures(action.userFeatures)
        .pipe(
          map(res => ({
            type: userSettingsActions.USER_FEATURES_SUCCESS,
            userFeatures: action.userFeatures
          })),
          catchError((err: any) => of({
            type: userSettingsActions.USER_FEATURES_ERROR,
            error: err
          }))
        );
    });

  @Effect()
  refreshUserFeaturesEffect$: Observable<Action> = this.actions$
    .ofType(userSettingsActions.USER_FEATURES_REFRESH)
    .mergeMap((action) => of(
      ({
        type: userSettingsActions.USER_FEATURES_DATA,
      })
    ));

  constructor(
    private actions$: Actions,
    private securityApiService: SecurityApiService,
    private validationApi: ValidationApiService,
    private deviceService: DeviceDetectorService,
    private bdbCypherService: BdbCypherService,
    private bdbStorageService: BdbStorageService,
    private store: Store<UserState>,
    private userFeaturesService: UserFeaturesDelegateService,
    private customerBasicDataService: CustomerBasicDataService,
    private bdbCryptoForgeProvider: BdbCryptoForgeProvider,
    private bdbMemoryProvider: BdbInMemoryProvider
  ) {}

  private fetchBasicData(): Observable<Action> {
    return this.getComplementaryData().pipe(
      map((basicData) => ({ type: userSettingsActions.USER_BASIC_DATA_SUCCESS, basicData })),
      catchError((error) => of({ type: userSettingsActions.USER_BASIC_DATA_ERROR }))
    );
  }

  private refreshBasicData(): Observable<Action> {
    return this.getComplementaryData().pipe(
      map((basicData) => ({ type: userSettingsActions.USER_BASIC_DATA_REFRESH_SUCCESS, basicData })),
      catchError((error) => of({ type: userSettingsActions.USER_BASIC_DATA_REFRESH_ERROR }))
    );
  }

  private getComplementaryData(): Observable<BasicDataRs> {
    return forkJoin(
      this.getUserDataBasic(),
      this.customerBasicDataService.getAll()
    ).pipe(
      map(([basicData, allData]) => {
        basicData.phone = allData.phone;
        basicData.emailAddr = allData.emailAddr;
        return basicData;
      }),
      catchError((err) => ErrorObservable.create(err))
    );
  }
  private getUserDataBasic(): Observable < BasicDataRs > {
    const newAuthResponse: NewLoginResponse = this.bdbMemoryProvider.getItemByKey(InMemoryKeys.AuthState);
    if (newAuthResponse) {
      const [name, secondName, surname, secondSurname] = newAuthResponse.fullName.split(' ');
        return of(
            {
                phone: newAuthResponse.telephone,
                emailAddr: newAuthResponse.email,
                fullName: newAuthResponse.fullName,
                secondLastName: secondSurname || '',
                lastName: surname || '',
                middleName: secondName || '',
                firstName: name,
                cdtOwner: newAuthResponse.cdtOwner

            })
    }
    return this.customerBasicDataService.getBasicData();
 }
}
