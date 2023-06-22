import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as loginActions from '../actions/login.action';
import * as userSettingsActions from '../actions/user-settings.action';
import * as catalogueActions from '../actions/catalogue.action';
import * as userSelector from '../selectors/user.selector';
import * as catalogueSelector from '../selectors/catalogue.selector';
import {UserState, UserFeaturesData} from '../states/user.state';
import { LastLoginRs } from 'new-app/core/services-apis/identity-validation/models/last-login.model';
import { UserFeatures } from '@app/apis/user-features/models/UserFeatures';
import { filter } from 'rxjs/operators';
import { CatalogsEnum } from '../../../../core/services-delegate/list-parameters/enums/catalogs-enum';
import { Catalogue, CreditByBank } from '@app/apis/user-features/models/catalogue.model';
import { BasicDataRs } from '@app/apis/customer-basic-data/models/getBasicData.model';

@Injectable()
export class UserFacade {
  user$: Observable<UserState> = this.store.select(userSelector.userState);
  basicData$: Observable<BasicDataRs> = this.store.select(userSelector.basicDataSelector);
  lastLogin$: Observable<LastLoginRs> = this.store.select(
    userSelector.lastLoginSelector
  );

  userFeaturesState$: Observable<UserFeaturesData> = this.store.select(userSelector.userFeaturesStateSelector);
  userFeatures$: Observable<UserFeatures> =
    this.store.select(userSelector.userFeaturesDataSelector).pipe(filter(userFeatures => !!userFeatures));
  userFeaturesWorking$: Observable<boolean> = this.store.select(userSelector.userFeaturesWorkingSelector);
  userFeaturesCompleted$: Observable<boolean> = this.store.select(userSelector.userFeaturesCompletedSelector);
  userFeaturesError$: Observable<any> = this.store.select(userSelector.userFeaturesErrorSelector);

  catalogue$: (CatalogsEnum: CatalogsEnum) => Observable<Catalogue[]> = (catalogueType: CatalogsEnum) =>
    this.store.select(catalogueSelector.catalogueByTypeSelector(catalogueType))

  transactionCostByType$: (costType: catalogueSelector.CostTypes) => Observable<string> = (costType: catalogueSelector.CostTypes) =>
    this.store.select(catalogueSelector.transactionCostByTypeSelector(costType))

  creditTypesByBank$: (idBank: string) => Observable<CreditByBank []> = (idBank: string) =>
    this.store.select(catalogueSelector.creditTypesByBankSelector(idBank))

  bankListForTransfers$: () => Observable<Catalogue []> = () =>
    this.store.select(catalogueSelector.listBankTransfersSelector())

  bankListForCredits$: () => Observable<Catalogue []> = () =>
    this.store.select(catalogueSelector.listBankCreditsSelector())

  bankListForCreditCard$: () => Observable<Catalogue []> = () =>
    this.store.select(catalogueSelector.listBankCreditCardSelector())

  constructor(private store: Store<UserState>) {
  }

  public getLastLogin(): void {
    this.store.dispatch(new loginActions.LastLoginAction());
  }

  public getPublicKey(): void {
    this.store.dispatch(new userSettingsActions.PublicKeyAction());
  }

  public getBasicData(): void {
    this.store.dispatch(new userSettingsActions.BasicDataAction());
  }

  public reset() {
    this.store.dispatch(new userSettingsActions.UserResetAction());
  }

  public getUserFeaturesData(): void {
    this.store.dispatch(new userSettingsActions.UserFeaturesAction());
  }

  public updateUserFeaturesData(userFeatures: UserFeatures): void {
    this.store.dispatch(new userSettingsActions.UserFeaturesUpdateAction(userFeatures));
  }

  public resetUserFeaturesData() {
    this.store.dispatch(new userSettingsActions.UserFeaturesRefreshAction());
  }

  public getCatalogue(catalogueType: CatalogsEnum): void {
    this.store.dispatch(new catalogueActions.GetCatalogueAction(catalogueType));
  }

  public refreshBasicData(): void {
    this.store.dispatch(new userSettingsActions.BasicDataRefreshAction());
  }

}
