import { Component, OnDestroy, OnInit } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, Loading} from 'ionic-angular';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { AccountBalance } from '../../../../app/models/enrolled-transfer/account-balance';
import { AccountAny } from '../../../../app/models/enrolled-transfer/account-any';
import { EnrollProvider } from '../../../../providers/enroll/enroll';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { CreditCardPaymentInfo } from '../../../../app/models/tc-payments/credit-card-payment-info';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { CCObligationsFacade } from '../../../../new-app/modules/payments/store/facades/cc-obligations.facade';
import {SubscribeObligationService} from '../../../../new-app/modules/payments/services/subscribe-obligations.service';
import { BdbNormalizeDiacriticDirective } from '../../../../directives/bdb-normalize-diacritic/bdb-normalize-diacritic';
import {ManageOblRq} from '@app/apis/transfer/transfer-core/models/manage-obl.model';
import {PaymentObligation} from '@app/apis/transfer/transfer-core/models/payment-obligations.model';

@PageTrack({ title: 'subscribe-credit-card-alias' })
@IonicPage({
  name: 'subscribe%credit-card%alias',
})
@Component({
  selector: 'page-enroll-credit-card-alias',
  templateUrl: 'enroll-credit-card-alias.html',
})
export class EnrollCreditCardAliasPage implements OnDestroy, OnInit {

  acctNickNameForm: FormGroup;
  payNow: boolean;
  title: string;
  subtitle: string;
  enrolledCreditCards: Array<AccountBalance>;
  abandonText = BdbConstants.ABANDON_PAY;
  navTitle = 'Inscripción de tarjetas';
  private _funnel = this.funnelKeys.getKeys().enrollCreditCards;

  private ccObligationsSub$ = new Subscription();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private loadingController: LoadingController,
    private bdbModal: BdbModalProvider,
    private enroll: EnrollProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private navigation: NavigationProvider,
    private ccObligationsFacade: CCObligationsFacade,
    private subscribeObligationService: SubscribeObligationService
  ) { }

  ngOnInit(): void {
    this.title = 'Ingresa un nombre para esta tarjeta';
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
    this.ccObligationsSub$.unsubscribe();
  }

  private nextStepWhenSelectPayNow(
    paymentObligations: PaymentObligation[],
    productId: string
  ): void {

    const sixTeenDigits = (num: string) => {
      return num.substring(num.length - 16);
    };

    const ccObligation = paymentObligations.find((obligation: PaymentObligation) =>
      sixTeenDigits(obligation.productNumber) === sixTeenDigits(productId)
    );

    if (!!ccObligation && this.payNow) {
      const creditCard = new AccountBalance(
        ccObligation.productBank,
        ccObligation.bankId,
        ccObligation.productAlias,
        ccObligation.productType,
        sixTeenDigits(ccObligation.productNumber),
        ccObligation.productName,
        null,
        null,
        ccObligation.aval,
        null
      );

      const ccPaymentInfo: CreditCardPaymentInfo = new CreditCardPaymentInfo();
      const mCreditCard: AccountAny = new AccountAny(false, null, creditCard);
      ccPaymentInfo.creditCard = mCreditCard;
      ccPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
      this.bdbInMemory.setItemByKey(InMemoryKeys.CreditCardInfo, ccPaymentInfo);
      this.navCtrl.push('creditcard%enrolled%amount', {
        subscribe: true
      });
    } else if (!(!!ccObligation) && this.payNow) {
      this.bdbModal.launchErrModal(
        'La información no es válida',
        'Transacción rechazada. Cuenta destino no autorizada, comuníquese con la entidad',
        'Continuar',
        () => {
          this.onAbandonClicked();
        }
      );
    }
  }

  triggerAction(payNow: boolean) {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.alias);
    this.payNow = payNow;

    const subscribeOblRq: ManageOblRq = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductToEnroll);
    subscribeOblRq.targetName = this.acctNickNameForm.controls.nickName.value;
    this.bdbInMemory.setItemByKey(InMemoryKeys.ProductToEnroll, subscribeOblRq);

    const loading = this.loadingController.create();
    loading.present().then(() => {
      this.subscribeObligationService.subscribeObligations().subscribe(
        () => {
          this.getCreditCardsEnrrolled(loading, subscribeOblRq);
        }, () => {
          loading.dismiss();
          this.bdbModal.launchErrModal(
            'Ha ocurrido un error',
            'No se pudo inscribir la tarjeta, por favor intenta más tarde.',
            'Aceptar',
            () => {
              this.onAbandonClicked();
            });
        }
      );
    });
  }

  private getCreditCardsEnrrolled(loading: Loading, subscribeOblRq: ManageOblRq) {
    this.ccObligationsFacade.updateCCObligations();
    this.ccObligationsSub$ = combineLatest(
      this.ccObligationsFacade.ccObligations$,
      this.ccObligationsFacade.ccObligationsCompleted$,
      this.ccObligationsFacade.ccObligationsWorking$,
      this.ccObligationsFacade.ccObligationsError$
    ).subscribe(([ccObligations, completed, working, error]) => {

      if (!working && completed) {
        loading.dismiss();

        if (this.payNow) {
          this.nextStepWhenSelectPayNow(ccObligations, subscribeOblRq.targetAccountId);
        } else {
          this.onAbandonClicked();
        }

      } else if (!working && !completed && !!error) {
        loading.dismiss();
        this.bdbModal.launchErrModal(
          'Error general',
          'Error al consultar las TC inscritas, por favor intente de nuevo',
          'Continuar', () => {
            this.onAbandonClicked();
          });
      }

    });
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }
}
