import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DebitCardActivationRq, DebitCardActivationRs } from './models/debitCardActivation.dto';
import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import { LimitUpdateNatAccRq, LimitUpdateNatAccRs } from './models/limitUpdateNatAcc.model';
import { DebitCardUpdatePinRequest } from './models/update-pin.model';
import { BdBGenericResponse } from '../../models/generic-rs.model';
import { DebitCardLockRq, DebitCardLockRs } from './models/debitCardLock.dto';
import { LimitInformationNatAccRq, LimitInformationNatAccRs } from './models/limitInformationNatAcc.model';
import { LimitInformationRq, LimitInformationRs } from './models/limitInformation.model';
import { LimitUpdateRq, LimitUpdateRs } from './models/limitUpdate.model';
import { CreditCardActivationRq, CreditCardActivationRs } from './models/creditCardActivation';
import { CreditCardAccountInfoRq, CreditCardAccountInfoRs } from './models/creditCardAccountInfo';
import { CreditCardBlockRq, CreditCardBlockRs } from './models/creditCardBlock';
import { CreditCardUnblockRq, CreditCardUnblockRs } from './models/creditCardUnblock';
import { CreditCardSetPinRq } from './models/set-pin.model';
import {
  BandActivationRq,
  DebitCardBandFindRs
} from '@app/apis/customer-security/models/debitCardBandActivations.model';

@Injectable()
export class CustomerSecurityService {

  private readonly CONST_CUSTOMER_SECURITY_URL = 'customer-security';
  private readonly CONST_LIMIT_INFO_NAT_ACC_OP = 'get-limits-nat-acc';
  private readonly CONST_LIMIT_UPDATE_NAT_ACC_OP = 'edit-limits-nat-acc';
  private readonly CONST_ACTIVATION_DEBIT_CARD_OP = 'debit-card/activation';
  private readonly CONST_LOCK_DEBIT_CARD_OP = 'debit-card/lock';
  private readonly CONST_UPDATE_PIN_OP = 'debit-card/pin';
  private readonly CONST_LIMIT_INFO_OP = 'get-limits';
  private readonly CONST_LIMIT_UPDATE_OP = 'edit-limits';
  private readonly CONST_ACTIVATION_CREDIT_CARD = 'v2/credit-card/activation';
  private readonly CONST_ACCOUNT_INFO_CREDIT_CARD = 'v2/credit-card/account-info';
  private readonly CONST_BLOCK_CREDIT_CARD = 'v2/credit-card/block';
  private readonly CONST_UNBLOCK_CREDIT_CARD = 'v2/credit-card/unblock';
  private readonly CONST_DEBIT_CARD_BAND_ACTIVATION_CREATE = 'debit-card/band/create';
  private readonly CONST_DEBIT_CARD_BAND_ACTIVATION_FIND = 'debit-card/band/find';
  private readonly CONST_DEBIT_CARD_BAND_ACTIVATION_EDIT = 'debit-card/band/update';
  private readonly CONST_DEBIT_CARD_BAND_ACTIVATION_DELETE = 'debit-card/band/delete';
  private readonly CONST_SET_PIN = 'set-card-pin';

  constructor(
    private bdbHttp: HttpClientWrapperProvider
  ) {
  }

  public debitCardActivation(body: DebitCardActivationRq): Observable<DebitCardActivationRs> {
    return this.bdbHttp
      .postToADLApi<DebitCardActivationRq, DebitCardActivationRs>(
        body,
        `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_ACTIVATION_DEBIT_CARD_OP}`
      );
  }

  public debitCardLock(body: DebitCardLockRq): Observable<DebitCardLockRs> {
    return this.bdbHttp
      .postToADLApi<DebitCardLockRq, DebitCardLockRs>(
        body,
        `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_LOCK_DEBIT_CARD_OP}`
      );
  }

  public updatePin(body: DebitCardUpdatePinRequest): Observable<BdBGenericResponse> {
    return this.bdbHttp
      .postToADLApi<DebitCardUpdatePinRequest, BdBGenericResponse>(
        body,
        `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_UPDATE_PIN_OP}`
      );
  }

  public limitInformationNatAcc(body: LimitInformationNatAccRq): Observable<LimitInformationNatAccRs> {
    return this.bdbHttp
      .postToADLApi<LimitInformationNatAccRq, LimitInformationNatAccRs>(
        body,
        `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_LIMIT_INFO_NAT_ACC_OP}`
      );
  }

  public limitUpdateNatAcc(body: LimitUpdateNatAccRq): Observable<LimitUpdateNatAccRs> {
    return this.bdbHttp
      .postToADLApi<LimitUpdateNatAccRq, LimitUpdateNatAccRs>(
        body,
        `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_LIMIT_UPDATE_NAT_ACC_OP}`
      );
  }

  public limitInformation(body: LimitInformationRq): Observable<LimitInformationRs> {
    return this.bdbHttp
      .postToADLApi<LimitInformationRq, LimitInformationRs>(
        body,
        `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_LIMIT_INFO_OP}`
      );
  }

  public limitUpdate(body: LimitUpdateRq): Observable<LimitUpdateRs> {
    return this.bdbHttp
      .postToADLApi<LimitUpdateRq, LimitUpdateRs>(
        body,
        `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_LIMIT_UPDATE_OP}`
      );
  }

  public creditCardActivation(body: CreditCardActivationRq): Observable<CreditCardActivationRs> {
    return this.bdbHttp
      .postToADLApi<CreditCardActivationRq, CreditCardActivationRs>(
        body,
        `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_ACTIVATION_CREDIT_CARD}`
      );
  }

  public creditCardAccountInfo(body: CreditCardAccountInfoRq): Observable<CreditCardAccountInfoRs> {
    return this.bdbHttp
      .postToADLApi<CreditCardAccountInfoRq, CreditCardAccountInfoRs>(
        body, `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_ACCOUNT_INFO_CREDIT_CARD}`
      );
  }

  public creditCardBlock(body: CreditCardBlockRq): Observable<CreditCardBlockRs> {
    return this.bdbHttp
      .postToADLApi<CreditCardBlockRq, CreditCardBlockRs>(
        body,
        `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_BLOCK_CREDIT_CARD}`
      );
  }

  public creditCardUnblock(body: CreditCardUnblockRq): Observable<CreditCardUnblockRs> {
    return this.bdbHttp
      .postToADLApi<CreditCardUnblockRq, CreditCardUnblockRs>(
        body,
        `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_UNBLOCK_CREDIT_CARD}`
      );
  }


  public debitCardBandActivationCreate(body: BandActivationRq): Observable<DebitCardBandFindRs> {
    return this.bdbHttp.postToADLApi<BandActivationRq, DebitCardBandFindRs>(
      body, `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_DEBIT_CARD_BAND_ACTIVATION_CREATE}`
    );
  }

  public debitCardBandActivationEdit(body: BandActivationRq): Observable<DebitCardBandFindRs> {
    return this.bdbHttp.postToADLApi<BandActivationRq, DebitCardBandFindRs>(
      body, `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_DEBIT_CARD_BAND_ACTIVATION_EDIT}`
    );
  }

  public debitCardBandActivationDelete(body: BandActivationRq): Observable<DebitCardBandFindRs> {
    return this.bdbHttp.postToADLApi<BandActivationRq, DebitCardBandFindRs>(
      body, `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_DEBIT_CARD_BAND_ACTIVATION_DELETE}`
    );
  }

  public debitCardBandActivationFind(body: BandActivationRq): Observable<DebitCardBandFindRs> {
    return this.bdbHttp.postToADLApi<BandActivationRq, DebitCardBandFindRs>(
      body, `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_DEBIT_CARD_BAND_ACTIVATION_FIND}`
    );
  }

  public setCardPin(body: CreditCardSetPinRq): Observable<BdBGenericResponse> {
    return this.bdbHttp.postToADLApi<CreditCardSetPinRq, BdBGenericResponse>(
      body, `${this.CONST_CUSTOMER_SECURITY_URL}/${this.CONST_SET_PIN}`
    );
  }

}
