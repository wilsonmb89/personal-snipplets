import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
import { Settings, UserFeatures } from '@app/apis/user-features/models/UserFeatures';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { UserFeaturesService } from '@app/apis/user-features/user-features.service';


export type toggleAllowedOTPMapperType =
  'accountInscription' |
  'accountTransfer' |
  'billInscription' |
  'billPayment' |
  'creditCardInscription' |
  'creditCardPayment' |
  'creditInscription' |
  'creditPayment' |
  'pilaPayment' |
  'taxPayment' |
  'recharges' |
  'updateData' |
  'limitChanges' |
  'limitChangeNationalAccount' |
  'login' |
  'debitCardActivation' |
  'creditCardActivation';

export type settingsOnBoardingMapperType =
  'onBoardingPockets' |
  'anyOtherService';

export type allowedServiceMapperType =
  'pockets' |
  'activateTD' |
  'dianTaxPayment' |
  'pqrInquiry' |
  'enableSetCardPin' |
  'cardsSecurity' |
  'toggleTC' |
  'facilpass' |
  'setCCPin' |
  'crossSellSavingAccountSDA' |
  'crossSellCreditCardCCA' |
  'crossSellMortgageCreditDLA' |
  'crossSellCreditService568' |
  'crossSellCreditLOC' |
  'crossSellLifeInsurance678' |
  'crossSellCDTCDA' |
  'crossSellFiduciaryFDA'|
  'helpCenter'|
  'scheduledTransfers'|
  'extraordinaryPaymentCredit'|
  'betweenAccounts' |
  'cashAdvance';

@Injectable()
export class UserFeaturesDelegateService {

  constructor(
    private userFeaturesService: UserFeaturesService,
    private userFacade: UserFacade
  ) {
  }

  private settingsOnBoardingMapper = {
    onBoardingPockets: (userFeatures: UserFeatures) => userFeatures.settings.onBoarding.pockets,
    anyOtherService: (userFeatures: UserFeatures) => userFeatures.settings.onBoarding.anyOtherService
  };

  private toggleAllowedOTPMapper = {
    accountInscription: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.accountInscription,
    accountTransfer: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.accountTransfer,
    billInscription: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.billInscription,
    billPayment: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.billPayment,
    creditCardInscription: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.creditCardInscription,
    creditCardPayment: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.creditCardPayment,
    creditInscription: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.creditInscription,
    creditPayment: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.creditPayment,
    pilaPayment: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.pilaPayment,
    taxPayment: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.taxPayment,
    recharges: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.recharges,
    updateData: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.updateData,
    limitChanges: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.limitChanges,
    limitChangeNationalAccount: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.limitChangeNationalAccount,
    login: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.login,
    creditCardActivation: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.creditCardActivation,
    debitCardActivation: (userFeatures: UserFeatures) => userFeatures.toggle.allowedOTPServices.debitCardActivation,
  };

  private toggleAllowedServiceMapper = {
    pockets: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.pockets,
    activateTD: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.activateTD,
    dianTaxPayment: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.dianTaxPayment,
    pqrInquiry: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.pqrInquiry,
    enableSetCardPin: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.enableSetCardPin,
    cardsSecurity: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.cardsSecurity,
    toggleTC: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.toggleTC,
    facilpass: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.facilpass,
    setCCPin: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.setCCPin,
    crossSellSavingAccountSDA: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.crossSellSavingAccountSDA,
    crossSellCreditCardCCA: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.crossSellCreditCardCCA,
    crossSellMortgageCreditDLA: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.crossSellMortgageCreditDLA,
    crossSellCreditService568: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.crossSellCreditService568,
    crossSellCreditLOC: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.crossSellCreditLOC,
    crossSellLifeInsurance678: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.crossSellLifeInsurance678,
    crossSellCDTCDA: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.crossSellCDTCDA,
    crossSellFiduciaryFDA: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.crossSellFiduciaryFDA,
    extraordinaryPaymentCredit: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.extraordinaryPaymentCredit,
    helpCenter: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.helpCenter,
    scheduledTransfers: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.scheduledTransfers,
    betweenAccounts: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.betweenAccounts,
    cashAdvance: (userFeatures: UserFeatures) => userFeatures.toggle.allowedServices.cashAdvance,
  };

  public isOtpAllowedFor(type: toggleAllowedOTPMapperType): Observable<boolean> {
    return this.mapFeature(this.toggleAllowedOTPMapper[type]);
  }

  public isSettingsFor(type: settingsOnBoardingMapperType): Observable<boolean> {
    return this.mapFeature(this.settingsOnBoardingMapper[type]);
  }

  public isAllowedServiceFor(type: allowedServiceMapperType): Observable<boolean> {
    return this.mapFeature(this.toggleAllowedServiceMapper[type]);
  }

  public getUserSettings(): Observable<Settings> {
    return this.userFacade.userFeatures$.pipe(take(1)).map((userFeatures: UserFeatures) => userFeatures.settings);
  }

  private mapFeature(mapper: (d: UserFeatures) => boolean): Observable<boolean> {
    return this.userFacade.userFeatures$.pipe(take(1)).map(mapper);
  }

  public getUserFeatures(): Observable<UserFeatures> {
    return this.userFeaturesService.getUserFeatures();
  }

  public saveUserFeatures(userFeature: UserFeatures): Observable<UserFeatures> {
    return this.userFeaturesService.saveUserFeatures(userFeature);
  }

}
