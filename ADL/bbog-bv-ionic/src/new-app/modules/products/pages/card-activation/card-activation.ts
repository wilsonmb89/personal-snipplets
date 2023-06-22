import { IonicPage, NavController, Events } from 'ionic-angular';
import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { NavigationProvider } from '../../../../../providers/navigation/navigation';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { InMemoryKeys } from '../../../../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { PageTrack } from '../../../../../app/core/decorators/AnalyticTrack';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { CreditCardActivationRq } from '@app/apis/customer-security/models/creditCardActivation';
import { CreditCardFacade } from '../../../../shared/store/products/facades/credit-card.facade';
import { Subscription } from 'rxjs/Subscription';
import { CreditCardAccountInfoRs } from '@app/apis/customer-security/models/creditCardAccountInfo';
import { CreditCardState } from '@app/shared/store/products/states/credit-card.state';
import { AvalOpsProvider } from '../../../../../providers/aval-ops/aval-ops';
import { CardsInfoFacade } from '../../../../../new-app/modules/settings/store/facades/cards-info.facade';


@PageTrack({ title: 'card-activation' })
@IonicPage({
  name: 'CardActivationPage',
  segment: 'card-activation'
})
@Component({
  selector: 'card-activation-page',
  templateUrl: 'card-activation.html',
})
export class CardActivationPage implements OnInit {
  private readonly plasticValidator = {
    g: 'gold',
    p: 'platinum',
    i: 'infinite',
    b: 'black'
  };
  private validateNumberCard: string;
  private cardActivationSubscription: Subscription;
  private accountInfo: CreditCardAccountInfoRs;
  readonly navTitle = 'Activación de Tarjeta de Crédito';
  tokenForm: FormGroup;
  validateButton = true;
  plasticType: string;
  cardType: string;
  number = '';
  numberValidation = {
    validationError: false,
    labelerror: '',
  };

  constructor(
    private navigation: NavigationProvider,
    private navCtrl: NavController,
    private events: Events,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private genericModalService: GenericModalService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private avalOpsProvider: AvalOpsProvider,
    private cardsInfoFacade: CardsInfoFacade,
    private creditCardFacade: CreditCardFacade
  ) {
    this.validateNumberCard = bdbInMemory.getItemByKey(InMemoryKeys.ValidateNumberCard);
    const cardDescription = ((bdbInMemory.getItemByKey(InMemoryKeys.ActivationCard)).description).toLowerCase();
    this.cardType =  cardDescription.includes('mastercard') ? 'mastercard' : 'visa';
    this.plasticType = this.plasticValidator[cardDescription.replace(/(?:(?!gold|platinum|infinite|black).)/g, '')];
    if ( this.plasticType ===  undefined) {
        this.plasticType = 'classic';
      }
    this.tokenForm = this.formBuilder.group({
      number: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('[0-9]*')]]
    });
  }

  public ngOnInit(): void {
    this.cardActivationSubscription = this.creditCardFacade.creditCardActivationState$.subscribe(
      cacResponse => {
        this.accountInfo = cacResponse.accountInfoSuccess;
        if (!!cacResponse.activationSuccess) {
          this.cardsInfoFacade.refreshCardsInfo();
          this.avalOpsProvider.refreshProductsInfo();
        }
        this.showResponse(cacResponse);
      }
    );
  }

  public ionViewWillEnter(): void {
    this.events.publish('srink', true);
  }

  public ionViewWillLeave(): void {
    if (this.cardActivationSubscription) {
      this.cardActivationSubscription.unsubscribe();
    }
  }

  public submitInput(): void {
    if (this.tokenForm.invalid && !this.validateButton) {
      this.activateCard();
    }
  }

  public onInputKeyDown(e: CustomEvent): void {
    if ( (e.detail.key === 'Enter') && (this.validateButton === false)) {
      this.submitInput();
    }
  }

  public onInputKeyUp(e): void {
    const originalNumber = e.target.value.toString();
    const spacedNum = originalNumber.replace(/\D/g, '').replace(/['`+^´Çç]/g, '');
    this.tokenForm.setValue({'number': spacedNum});
    if (originalNumber.length > 4) {
      this.tokenForm.setValue({'number': spacedNum.replace(/(.{4})/g, '$1 ')});
      if (e.target.value.toString().length >= 9) {
        this.tokenForm.setValue({'number': spacedNum.replace(/(.{4})/g, '$1 ').slice(0, 9)});
        if (this.validateNumberCard === spacedNum.replace(/\s/g, '')) {
          this.numberValidation.validationError = false;
          this.numberValidation.labelerror = '';
          this.validateButton = false;
        } else {
          this.numberValidation.validationError = true;
          this.numberValidation.labelerror = 'La información ingresada es incorrecta, intenta nuevamente.';
        }
      } else {
        this.validateButton = true;
      }
    }
  }

  public onBackPressed(): void {
    this.navigation.onBackPressed(this.navCtrl);
  }

  private activateCard(): void {
    const card = this.bdbInMemory.getItemByKey(InMemoryKeys.ActivationCard);
    const cardActivationRq: CreditCardActivationRq = {
      cardId: card.cardNumber
    };
    if (!!this.accountInfo) {
      if (this.accountInfo.cardMassiveProcess === 'U') {
        this.showConfirmModal(cardActivationRq);
      } else {
        this.creditCardFacade.creditCardActivation(cardActivationRq);
      }
    }
  }

  private showResponse(cardActivation: CreditCardState): void {
    if (!!cardActivation.activationSuccess) {
      this.navCtrl.push('ActivatedCardPage');
    }
    if (!!cardActivation.activationError) {
      if (cardActivation.activationError.status === 0) {
        this.showErrorModal('Pérdida de conexión', 'Por favor verifica tu conexión a Internet e inténtalo nuevamente.');
      } else {
        this.showErrorModal('Ha ocurrido un error', 'La solicitud no ha podido ser tramitada, inténtalo nuevamente.');
      }
    }
  }

  private showConfirmModal(cardActivationRq: CreditCardActivationRq): void {
    this.creditCardFacade.creditCardActivationReset();
    const genericModalData: GenericModalModel = {
      icon: {
        src: 'assets/imgs/payments/message-img.svg',
        alt: 'error'
      },
      modalTitle: 'Activación de Tarjeta',
      modalInfoData: `<span>${'Al activar la nueva tarjeta, se desactivará automáticamente la anterior. ¿Deseas activar la nueva tarjeta?'}</span>`,
      actionButtons: [
        {
          id: 'generic-btn-action-1',
          buttonText: 'No',
          block: true,
          colorgradient: true,
          action: () => {
            this.cardActivationSubscription.unsubscribe();
            this.navCtrl.push('DashboardPage');
          },
          fill: 'outline'
        },
        {
          id: 'generic-btn-action-1',
          buttonText: 'Si',
          block: true,
          colorgradient: true,
          action: () => {
            this.creditCardFacade.creditCardActivation(cardActivationRq);
          },
        }
      ]
    };
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

  private showErrorModal(title: string, messageError: string): void {
    this.creditCardFacade.creditCardActivationReset();
    const genericModalData: GenericModalModel = {
      icon: {
        src: 'assets/imgs/payments/message-img.svg',
        alt: 'error'
      },
      modalTitle: title,
      modalInfoData: `<span>${messageError}</span>`,
      actionButtons: [{
        id: 'generic-btn-action-1',
        buttonText: 'Cargar de nuevo',
        block: true,
        colorgradient: true,
        action: () => {
          this.cardActivationSubscription.unsubscribe();
          this.navCtrl.push('DashboardPage');
        },
      }]
    };
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }
}
