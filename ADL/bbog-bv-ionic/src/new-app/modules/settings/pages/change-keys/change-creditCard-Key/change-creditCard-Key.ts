import { IonicPage, NavController, Events } from 'ionic-angular';
import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { CreditCardService } from '@app/modules/products/services/credit-card.service';
import { CustomerCard } from 'app/models/activation-cards/customer-cards-list-rs';
import { FlowChangeKeysFacade } from '@app/modules/settings/store/facades/flow-change-keys.facade';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { BdbLoaderService } from '@app/shared/utils/bdb-loader-service/loader.service';

@IonicPage({
  name: 'CreditCardChangeKeyPage',
  segment: 'change-key',
})
@Component({
  selector: 'card-activation-page',
  templateUrl: 'change-creditCard-Key.html',
})
export class CreditCardChangeKeyPage implements OnInit, OnDestroy {

  private creditCard$: Observable<CustomerCard> = this.flowChangeKeysFacade.creditCardFlowPass$;
  private customerSecuritySubscription: Subscription;

  displayNumber: string;
  cardNumber: string;
  textPinDescription = 'Esta debe contener 4 dígitos y solo 2 dígitos pueden ser consecutivos Ej.: 1206.';
  inputLabelKeyPin = 'Clave de avances';
  inputLabelConfirmPin = 'Confirmar clave de avances';
  btnTextPin = 'Cambiar clave';
  actualHeight: string;

  constructor(
    private navCtrl: NavController,
    private events: Events,
    private flowChangeKeysFacade: FlowChangeKeysFacade,
    private creditCardService: CreditCardService,
    private pulseToastService: PulseToastService,
    private genericModalService: GenericModalService,
    private resolver: ComponentFactoryResolver,
    private viewRef: ViewContainerRef,
    private loader: BdbLoaderService,
  ) { }

  public ngOnInit(): void {
    this.creditCard$.pipe(
      take(1)
    ).subscribe((creditCard: CustomerCard) => {
      this.displayNumber = creditCard.displayNumber;
      this.cardNumber = creditCard.cardNumber;
    });
    this.actualHeight = document.getElementById('navmaster').style.height;
  }

  public ngOnDestroy(): void {
    this.flowChangeKeysFacade.resetDebitCardFlowPass();
  }

  public ionViewWillEnter(): void {
    this.events.publish('srink', true);
    document.getElementById('navmaster').style.height = '100%';
  }

  public ionViewWillLeave(): void {
    if (this.customerSecuritySubscription) {
      this.customerSecuritySubscription.unsubscribe();
    }
    document.getElementById('navmaster').style.height = this.actualHeight;
  }

  public onBackPage(): void {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('DashboardPage');
    }
  }

  public dimissChangeKey(): void {
    this.navCtrl.setRoot('DashboardPage');
  }

  public changeKey(key: string) {
    this.loader.show();
    this.customerSecuritySubscription = this.creditCardService.setCreditCardPin(this.cardNumber, key)
      .subscribe(async res => {
        if (res.approvalId === '0') {
          const toatsTitle = 'Cambio de clave exitoso.';
          await this.pulseToastService.create(this.creditCardService.buildToastOptions(toatsTitle));
          this.navCtrl.push('ChangeKeysPage');
        } else {
          this.showErrorModal();
        }
        this.loader.hide();
      }, () => {
        this.showErrorModal();
        this.loader.hide();
      });
  }

  private showErrorModal(): void {
    const modalInfo = {
      infoData: 'En estos momentos no podemos hacer el cambio de tu clave. Por favor inténtalo más tarde.',
      navCtrlRedirect: 'ChangeKeysPage'
    };
    const genericModalData: GenericModalModel = this.creditCardService.buildModalErrorData(this.navCtrl, modalInfo);
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }
}

