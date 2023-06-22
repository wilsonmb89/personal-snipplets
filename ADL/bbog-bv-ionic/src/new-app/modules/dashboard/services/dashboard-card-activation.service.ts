import { Injectable } from '@angular/core';
import { DashboardCardActivation } from '../models/dashboard-cardActication.model';
import { CustomerCard } from '../../../../app/models/activation-cards/customer-cards-list-rs';

@Injectable()
export class DashboardCardActivationService {
  private readonly DEBIT_CARD_PENDING = 'E';
  private readonly CREDIT_CARD_PENDING = '4';
  private readonly DEBIT_CARD = 'DEB';
  private readonly CREDIT_CARD = 'CRE';
  labelText = 'Ya puedes activar tu';
  debitText = ' <br> Tarjeta Débito ';
  creditText = ' <br> Tarjeta de Crédito ';
  multipleButtonText = 'Actívalas aquí';
  buttonText = 'Actívala aquí';
  buttonImgSrc = ' <img src="assets/imgs/round-chevron-left-24-px-white.svg">';
  pendingCardsCount = 0;

  constructor() { }

  public validateActivationType(customerCardsList: CustomerCard[]): DashboardCardActivation {
    const cardNotification: DashboardCardActivation = {
      CardFirstText: '',
      CardSecondText: '',
      creditCardActivation: false,
      isActivationCard: false,
      multipleCardsActivation: false,
      debitCardActivation: false,
      activationCardSelected: null,
    };
    if (!!customerCardsList && customerCardsList.length > 0) {
      const { debitCard, creditCard } = this.getMultiplePendingCards(customerCardsList);
      if (debitCard.length === 1 && creditCard.length === 0) {
        return {
          ...cardNotification,
          cardsActivation: debitCard.concat(creditCard),
          CardFirstText: this.getCardTextByName(this.debitText, debitCard[0]),
          CardSecondText: this.buttonText + this.buttonImgSrc,
          activationCardSelected: debitCard[0],
          debitCardActivation: true,
          isActivationCard: true,
        };
      } else if (creditCard.length === 1 && debitCard.length === 0) {
        return {
          ...cardNotification,
          cardsActivation: debitCard.concat(creditCard),
          CardFirstText: this.getCardTextByName(this.creditText, creditCard[0]),
          CardSecondText: this.buttonText + this.buttonImgSrc,
          creditCardActivation: true,
          isActivationCard: true,
        };
      } else if (creditCard.length >= 1 || debitCard.length >= 1) {
        return {
          ...cardNotification,
          cardsActivation: debitCard.concat(creditCard),
          CardFirstText: `Tienes ${this.pendingCardsCount} Tarjetas por <br> activar`,
          CardSecondText: this.multipleButtonText + this.buttonImgSrc,
          multipleCardsActivation: true,
          isActivationCard: true,
        };
      } else {
        return cardNotification;
      }
    } else {
      return cardNotification;
    }
  }

  private getMultiplePendingCards(customerCardsList: CustomerCard[]): { debitCard: CustomerCard[], creditCard: CustomerCard[] } {
    const cards = {
      debitCard: [],
      creditCard: []
    };

    if (!!customerCardsList && customerCardsList.length > 0) {
      cards.debitCard = customerCardsList
        .filter(customerCard => customerCard.cardState === this.DEBIT_CARD_PENDING && customerCard.cardType === this.DEBIT_CARD);
      cards.creditCard  = customerCardsList
        .filter(customerCard => customerCard.cardState === this.CREDIT_CARD_PENDING && customerCard.cardType === this.CREDIT_CARD);
    }
    this.pendingCardsCount = cards.debitCard.length + cards.creditCard.length;

    return cards;
  }

  private getCardTextByName(cardType: string, card: CustomerCard): string {
    return this.labelText + cardType + (card && card.description ? card.description : '');
  }

}
