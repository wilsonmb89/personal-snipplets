import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CreditCardFacade } from '@app/shared/store/products/facades/credit-card.facade';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { CreditCardBlockRq } from '@app/apis/customer-security/models/creditCardBlock';
import { CreditCardUnblockRq } from '@app/apis/customer-security/models/creditCardUnblock';
import { PulseToastOptions } from '@app/shared/components/pulse-toast/model/generic-toast.model';
import { CustomerCard } from 'app/models/activation-cards/customer-cards-list-rs';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { ProductDetail } from 'app/models/products/product-model';

@Injectable()
export class CreditCardBlockingService {
  readonly URL_SERVILINEA =
    'https://www.bancodebogota.com/wps/portal/banco-de-bogota/bogota/atencion-al-cliente/necesita-ayuda/servilineas';
  private readonly PREVENTIVE_BLOCK_TEXT =
  `<p>Descongela tu Tarjeta cuando quieras. No estas eximido de pagos de cuota de manejo o deudas. En caso de pérdida, ` +
  `robo, deberás comunicarte con la <a href="${this.URL_SERVILINEA}" target="_blank">servilínea</a>.</p>`;
  private readonly UNUSUAL_BLOCK_TEXT =
    `<p>Este bloqueo es realizado por el Banco, ya que se ha registrado una compra o transacción inusual, comunícate con ` +
    `la <a href="${this.URL_SERVILINEA}" target="_blank">servilínea</a>.</p>`;
  private readonly THEFT_OR_LOSS_BLOCK_TEXT =
    `<p>Bloqueaste tu Tarjeta por pérdida, robo o fraude, no estás eximido de pagos de tu deuda. Es necesario que solicites ` +
    `una nueva tarjeta en la <a href="${this.URL_SERVILINEA}" target="_blank">servilínea</a>.</p>`;

  readonly CREDIT_CARD_BLOCK_SETTINGS =
    `Congela y descongela tus tarjetas cuando lo necesites, recuerda no podrás realizar compras o avances ` +
    `cuando tu tarjeta esté congelada. En caso de pérdida, robo o fraude será necesario comunicarte con ` +
    `la <a href="${this.URL_SERVILINEA}" target="_blank">servilínea</a>.`;
  private readonly UNUSUAL_BLOCK_TEXT_SETTINGS =
    `<p>Se ha registrado una compra o transacción inusual, comunícate con la servilínea.</p>`;
  private readonly THEFT_OR_LOSS_BLOCK_TEXT_SETTINGS =
    `Tu tarjeta se encuentra bloqueada por pérdida, robo o fraude, es necesario que solicites ` +
    `una nueva tarjeta en la <a href="${this.URL_SERVILINEA}" target="_blank">servilínea</a>.`;

  private readonly MODAL_BLOCK_TITLE = '¿Estás seguro de congelar tu tarjeta?';
  private readonly MODAL_BLOCK_DESC =
    `Descongela tu tarjeta cuando quieras. Recuerda, no podrás realizar compras o avances y <b>no te exime de pagos de cuota de manejo o deudas</b>.`;
  private readonly MODAL_UNBLOCK_TITLE = '¿Estás seguro de descongelar tu tarjeta?';
  private readonly MODAL_UNBLOCK_DESC = 'Al descongelar, podrás usarla de <br>inmediato para compras virtuales y entre <br>2 a 3 días para compras en tiendas <br>físicas. <br>No te exime de pagos de cuota de manejo o deudas.';

  private readonly BLOCK_DESCRIPTION_PREVENTIVE = 'PREVENTIVO POR OFICINA';
  private readonly BLOCK_REASON_PREVENTIVE = '41';

  private readonly UNBLOCK_DESCRIPTION_PREVENTIVE = 'Desbloqueo por cancelación manual';
  private readonly UNBLOCK_PLASTIC_VALIDATION = '0';

  readonly PREVENTIVE_BY_OFFICE = 'P';
  readonly PREVENTIVE_BY_BANK = 'U';
  readonly FRAUD = 'F';
  readonly THEFT_OR_LOSS = 'S';
  readonly FAIL_INFO_CARD = 'UNDEFINED';

  constructor() {}

  public getBlockText(blockType: string, settings?: boolean): string {
    switch (blockType) {
      case this.PREVENTIVE_BY_OFFICE:
        return settings ? '' : this.PREVENTIVE_BLOCK_TEXT;
      case this.PREVENTIVE_BY_BANK:
        return settings ? this.UNUSUAL_BLOCK_TEXT_SETTINGS : this.UNUSUAL_BLOCK_TEXT;
      case this.FRAUD:
        return settings ? this.THEFT_OR_LOSS_BLOCK_TEXT_SETTINGS : this.THEFT_OR_LOSS_BLOCK_TEXT;
      case this.THEFT_OR_LOSS:
        return settings ? this.THEFT_OR_LOSS_BLOCK_TEXT_SETTINGS : this.THEFT_OR_LOSS_BLOCK_TEXT;
    }
  }

  public buildModalData(block: boolean, productNumber: string, cardFacade: CreditCardFacade): GenericModalModel {
    const genericModalData: GenericModalModel = {
      icon: {
        src: 'assets/imgs/payments/message-img.svg',
        alt: 'error'
      },
      modalTitle: this.getModalTitle(block),
      modalInfoData: `<span>${this.getModalDesc(block)}</span>`,
      hideCloseButton: true,
      actionButtons: [{
        id: 'generic-btn-action-1',
        buttonText: 'No',
        block: true,
        colorgradient: true,
        action: () => {},
        fill: 'outline'
      },
      {
        id: 'generic-btn-action-1',
        buttonText: 'Si',
        block: true,
        colorgradient: true,
        action: () => {
          cardFacade.creditCardActivationReset();
          if (block) {
            const creditCardBlockRq: CreditCardBlockRq = {
              cardId: productNumber,
              statusDesc: this.BLOCK_DESCRIPTION_PREVENTIVE,
              lockId: this.PREVENTIVE_BY_OFFICE,
              blockReason: this.BLOCK_REASON_PREVENTIVE
            };
            cardFacade.creditCardBlock(creditCardBlockRq);
          } else {
            const crecitCardUnblockRq: CreditCardUnblockRq = {
              cardId: productNumber,
              statusDesc: this.UNBLOCK_DESCRIPTION_PREVENTIVE,
              plasticValidation: this.UNBLOCK_PLASTIC_VALIDATION
            };
            cardFacade.creditCardUnblock(crecitCardUnblockRq);
          }
        }
      }]
    };
    return genericModalData;
  }

  public buildModalError(navCtrl: NavController, cardFacade: CreditCardFacade): GenericModalModel {
    const genericModalData: GenericModalModel = {
      icon: {
        src: 'assets/imgs/payments/message-img.svg',
        alt: 'error'
      },
      modalTitle: 'Ha ocurrido un error',
      modalInfoData: '<span>La solicitud no ha podido ser tramitada, inténtalo nuevamente.</span>',
      hideCloseButton: true,
      actionButtons: [{
        id: 'generic-btn-action-1',
        buttonText: 'Entendido',
        block: true,
        colorgradient: true,
        action: () => {
          cardFacade.creditCardActivationReset();
          navCtrl.setRoot('DashboardPage');
        }
      }]
    };
    return genericModalData;
  }

  public buildDebitListCard(cards: CustomerCard[]): CustomerCard[] {
    return cards.map((e: CustomerCard) => {
      e.nameCard = 'Tarjeta Débito';
      e['logoPath'] = BdbConstants.DEBIT_CARD;
      return e;
    });
  }

  public buildCreditListCard(cards: CustomerCard[]): CustomerCard[] {
    return cards.map((card: CustomerCard) => this.setCardInformation(card));
  }

  public buildProductCreditListCard(cards: CustomerCard[], customerProductList: ProductDetail[]): CustomerCard[] {
    const newCard: CustomerCard[] = [];
    cards.forEach((card: CustomerCard) => {
      const productCard = customerProductList.find(product => product.productNumberApi === card.cardNumber);
      card = this.setCardInformation(card);
      if (!!productCard) {
        newCard.push(card);
      }
    });
    return newCard;
  }

  public showRequestCardButton(blockType: string): boolean {
    return blockType === this.THEFT_OR_LOSS || blockType === this.FRAUD;
  }

  public disableButton(blockType: string): boolean {
    return blockType !== this.PREVENTIVE_BY_OFFICE;
  }

  public enabledToFreeze(blockType: string): boolean {
    return blockType === this.PREVENTIVE_BY_OFFICE || blockType === '';
  }

  public showBlockCreditCardTagSettings(cardState: string): boolean {
    return cardState === this.THEFT_OR_LOSS ||
      cardState === this.FRAUD ||
      cardState === this.PREVENTIVE_BY_BANK ||
      cardState === this.PREVENTIVE_BY_OFFICE;
  }

  private getModalTitle(block: boolean): string {
    return block ? this.MODAL_BLOCK_TITLE : this.MODAL_UNBLOCK_TITLE;
  }

  private getModalDesc(block: boolean): string {
    return block ? this.MODAL_BLOCK_DESC : this.MODAL_UNBLOCK_DESC;
  }

  public getToastCreditCard(block: boolean): PulseToastOptions {
    const imageName = 'frozen-icon.svg';
    const cardToastSuccess: PulseToastOptions = {
        text: block ? '¡Tu Tarjeta ha sido congelada con éxito!' : '¡Tu Tarjeta ha sido descongelada con éxito!',
        image:  `../../../../assets/imgs/pulse-toast/${imageName}`
    };
    return cardToastSuccess;
  }

  private setCardInformation(card: CustomerCard): CustomerCard {
    let cardType = card.description.replace(/^\S+\s+(.+)$/g, '$1 ').replace(/\[?\b(?:Mastercard|Visa)\b\]?/g, '');
    if ( cardType === null || cardType === '' || cardType === ' ') {
      cardType = 'classic';
    }
    card.nameCard = 'Tarjeta de Crédito ' + cardType;
    card['logoPath'] = card.lockId === 'P' ? BdbConstants.FROZEN_CARD :
      card.description.includes('Visa') ? BdbConstants.VISA_LOGO : BdbConstants.MASTERCARD_SIMPLE_LOGO;
    return card;
  }
}
