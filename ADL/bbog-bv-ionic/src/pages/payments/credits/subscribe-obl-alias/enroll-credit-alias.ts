import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { LoanPaymentInfo } from '../../../../app/models/credits/loan-payment-info';
import { AccountAny } from '../../../../app/models/enrolled-transfer/account-any';
import { AccountBalance } from '../../../../app/models/enrolled-transfer/account-balance';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { PaymentsProvider } from '../../../../providers/payments/payments';
import { Subscription } from 'rxjs/Subscription';
import { SubscribeObligationService } from '../../../../new-app/modules/payments/services/subscribe-obligations.service';
import { AcObligationsFacade } from '../../../../new-app/modules/payments/store/facades/ac-obligations.facade';
import {BdbStorageService} from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { BdbNormalizeDiacriticDirective } from '../../../../directives/bdb-normalize-diacritic/bdb-normalize-diacritic';
import {ManageOblRq} from '@app/apis/transfer/transfer-core/models/manage-obl.model';
import {PaymentObligation} from '@app/apis/transfer/transfer-core/models/payment-obligations.model';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';


@PageTrack({title: 'subscribe-credit-alias'})
@IonicPage({
  name: 'subscribe%credit%alias',
})
@Component({
  selector: 'page-enroll-credit-alias',
  templateUrl: 'enroll-credit-alias.html',
})
export class EnrollCreditAliasPage implements OnDestroy {

  acctNickNameForm: FormGroup;
  payNow: boolean;
  title: string;
  subtitle: string;
  enrolledCreditCards: Array<AccountBalance>;
  abandonText = BdbConstants.ABANDON_ENROLL;
  navTitle = 'Inscripción de créditos';
  bankList: any[];
  private _funnel = this.funnelKeys.getKeys().enrollCreditCards;

  private acObligationsSub$ = new Subscription();

  constructor(
    private payments: PaymentsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private loadingController: LoadingController,
    private bdbModal: BdbModalProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private navigation: NavigationProvider,
    private subscribeObligationService: SubscribeObligationService,
    private avalCreditObligationsFacade: AcObligationsFacade,
    private bdbStorageService: BdbStorageService,
    private userFacade: UserFacade
  ) {
    this.title = 'Ingresa un nombre para este crédito';
    this.subtitle = 'Nombre de favorito';
    this.acctNickNameForm = this.formBuilder.group({
      nickName: ['', [Validators.required]]
    });
  }

  public onTextChange(event): void {
    event.target.value = BdbNormalizeDiacriticDirective.normalizeDiacriticText(event.target.value);
    this.acctNickNameForm.controls['nickName'].setValue(event.target.value);
  }

  ngOnDestroy(): void {
    this.acObligationsSub$.unsubscribe();
  }

  triggerAction(payNow: boolean) {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.alias);
    const subscribeOblRq: ManageOblRq = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductToEnroll);
    subscribeOblRq.targetName = this.acctNickNameForm.get('nickName').value.toString();
    this.bdbInMemory.setItemByKey(InMemoryKeys.ProductToEnroll, subscribeOblRq);
    const loading = this.loadingController.create();

    loading.present().then(() => {
      this.subscribeObligationService.subscribeObligations().subscribe(
        (data) => {
          const subscribedCredit: PaymentObligation = {
            productBank: this.getBankName(subscribeOblRq.targetAccountBankId),
            bankId: subscribeOblRq.targetAccountBankId,
            aval: true,
            productAlias: subscribeOblRq.targetName,
            productName: subscribeOblRq.targetName,
            productType: subscribeOblRq.targetAccountType,
            productNumber: subscribeOblRq.targetAccountId,
            franchise: null
          };

          loading.dismiss();
          this.avalCreditObligationsFacade.addObligation(subscribedCredit);
           payNow ? this.handlePayNow(subscribedCredit) : this.handlePayAfter();

        }, () => {
          loading.dismiss();
          this.bdbModal.launchErrModal(
            'Ha ocurrido un error',
            'El crédito no se pudo inscribir, por favor intenta más tarde.',
            'Aceptar',
            () => {
              this.onAbandonClicked();
            });
        });
    });
  }


  private handlePayNow(creditEnrolled: PaymentObligation): void {
    const loanPaymentInfo: LoanPaymentInfo = new LoanPaymentInfo();
    const credit = new AccountBalance(
      creditEnrolled.productBank,
      creditEnrolled.bankId,
      creditEnrolled.productAlias,
      creditEnrolled.productType,
      creditEnrolled.productNumber,
      creditEnrolled.productName,
      null,
      null,
      creditEnrolled.aval,
      null
    );
    const mLoan: AccountAny = new AccountAny(false, null, credit);
    loanPaymentInfo.loan = mLoan;
    loanPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
    this.navCtrl.push('EnrolledAmountCreditsPage', {
      subscribe: true
    });
  }

  private handlePayAfter() {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.alias);
    this.navCtrl.setRoot('PaymentsMainPage', {
      tab: 'credits-payment'
    }, {
      animate: true,
      animation: 'ios-transition',
      direction: 'forward'
    });
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  getBankName(id: string): string {
    this.userFacade.bankListForCredits$().subscribe( bankList => this.bankList = bankList );
    const bank = this.bankList.find(e => {
      return e.id === id;
    });
    return bank.name;
  }

}
