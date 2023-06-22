import { IonicPage, NavController, Events } from 'ionic-angular';
import { Component, OnDestroy, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { PageTrack } from '../../../../../app/core/decorators/AnalyticTrack';
import { BdbInMemoryProvider } from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../../providers/storage/in-memory.keys';
import { Subscription } from 'rxjs/Subscription';
import { CardsInfoFacade } from '../../../../../new-app/modules/settings/store/facades/cards-info.facade';
import { CustomerCard } from '../../../../../app/models/activation-cards/customer-cards-list-rs';
import { DashboardCardActivationService } from '../../../dashboard/services/dashboard-card-activation.service';
import { DashboardCardActivation } from '../../../../../new-app/modules/dashboard/models/dashboard-cardActication.model';
import { CreditCardFacade } from '@app/shared/store/products/facades/credit-card.facade';
import { CreditCardService } from '../../services/credit-card.service';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { GenericModalModel } from '../../../../shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '../../../../shared/components/modals/generic-modal/provider/generic-modal.service';
import { BdbLoaderService } from '@app/shared/utils/bdb-loader-service/loader.service';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { UserFeatures } from '@app/apis/user-features/models/UserFeatures';
import { take } from 'rxjs/operators';

@PageTrack({ title: 'activated-card' })
@IonicPage({
  name: 'ActivatedCardPage',
  segment: 'activated-card'
})
@Component({
  selector: 'activated-card-page',
  templateUrl: 'activated-card.html',
})
export class ActivatedCardPage implements OnInit, OnDestroy {
  private cardsInfoSubscription: Subscription;
  private customerSecuritySubscription: Subscription;
  benefits = {};
  number = '';
  plasticType: string;
  cardType: string;
  showActivate: boolean;
  toggleIsActived: boolean;
  toggleIsEnabled = true;
  cardId: string;
  actualHeight: string;
  toogleKeyCard: boolean;

  textPinDescription = 'La clave debe contener 4 dígitos, solo 2 dígitos pueden ser consecutivos. Ej.: 1206.';
  inputLabelKeyPin = 'Clave de avances';
  inputLabelConfirmPin = 'Confirmar clave de avances';
  btnTextPin = 'Crear clave';
  private navMaster: any;

  constructor(
    private cardsInfoFacade: CardsInfoFacade,
    private dashboardCardActivationService: DashboardCardActivationService,
    private navCtrl: NavController,
    private events: Events,
    private bdbInMemory: BdbInMemoryProvider,
    private creditCardFacade: CreditCardFacade,
    private creditCardService: CreditCardService,
    private genericModalService: GenericModalService,
    private pulseToastService: PulseToastService,
    private resolver: ComponentFactoryResolver,
    private viewRef: ViewContainerRef,
    private loader: BdbLoaderService,
    private userFacade: UserFacade,
  ) {
    this.benefits = this.creditCardService.benefits;
    this.number = this.bdbInMemory.getItemByKey(InMemoryKeys.ValidateNumberCard);
    this.cardId = (this.bdbInMemory.getItemByKey(InMemoryKeys.ActivationCard)).cardNumber;
    const cardDescription = ((this.bdbInMemory.getItemByKey(InMemoryKeys.ActivationCard)).description).toLowerCase();
    this.cardType = cardDescription.includes('mastercard') ? 'mastercard' : 'visa';
    this.plasticType = this.creditCardService.plasticValidator[cardDescription.replace(/(?:(?!gold|platinum|infinite|black).)/g, '')];
    if (this.plasticType === undefined) {
      this.plasticType = 'classic';
    }
  }

  public ngOnInit(): void {
    this.getInactiveCardsAndCustomerInfo();
    this.toggleIsActived = false;
  }

  public ngOnDestroy(): void {
    this.cardsInfoSubscription.unsubscribe();
    this.events.publish('srink', false);
  }

  public ionViewWillEnter(): void {
    this.events.publish('srink', true);
    this.navMaster = document.getElementById('navmaster');
    this.navMaster.style.height = '100%';
    this.userFacade.userFeatures$
      .pipe(take(1))
      .subscribe((userFeatures: UserFeatures) => {
        this.toogleKeyCard = userFeatures.toggle.allowedServices.setCCPin;
      });
  }

  public ionViewWillLeave(): void {
    if (this.cardsInfoSubscription) {
      this.cardsInfoSubscription.unsubscribe();
    }
    if (this.customerSecuritySubscription) {
      this.customerSecuritySubscription.unsubscribe();
    }
    this.navMaster.style.height = window.innerHeight + 'px';
  }

  public redirectCardSelection(): void {
    this.navCtrl.push('CardSelectionPage');
  }

  private getInactiveCardsAndCustomerInfo(): void {
    this.cardsInfoFacade.refreshCardsInfo();
    this.cardsInfoSubscription = this.cardsInfoFacade.cardsInfo$.subscribe(
      (customerCardList: CustomerCard[]) => this.validateShowActivationCards(customerCardList)
    );
  }

  private validateShowActivationCards(customerCardsList: CustomerCard[]): void {
    const cardNotificationService: DashboardCardActivation = this.dashboardCardActivationService.validateActivationType(customerCardsList);
    this.showActivate =
      !cardNotificationService.creditCardActivation &&
      !cardNotificationService.debitCardActivation &&
      !cardNotificationService.isActivationCard &&
      !cardNotificationService.multipleCardsActivation;
  }

  public resetData(): void {
    this.creditCardFacade.creditCardActivationReset();
  }

  public toggleRenovation(): void {
    this.toggleIsActived = !this.toggleIsActived;
  }

  public showTooltip(): void {
    if (this.toogleKeyCard) {
      this.creditCardFacade.rememberKeyTooltipShow();
    }
    this.navCtrl.push('DashboardPage');
  }

  public changeKey(key: string) {
    this.loader.show();
    this.customerSecuritySubscription = this.creditCardService.setCreditCardPin(this.cardId, key)
      .subscribe(async res => {
        if (res.approvalId === '0') {
          const toatsTitle = 'Asignación de clave exitosa.';
          await this.pulseToastService.create(this.creditCardService.buildToastOptions(toatsTitle));
          this.navCtrl.push('DashboardPage');
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
      infoData: 'En estos momentos no es posible asignar tu clave. Por favor inténtalo más tarde.',
      navCtrlRedirect: 'DashboardPage'
    };
    const genericModalData: GenericModalModel = this.creditCardService.buildModalErrorData(this.navCtrl, modalInfo);
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

}
