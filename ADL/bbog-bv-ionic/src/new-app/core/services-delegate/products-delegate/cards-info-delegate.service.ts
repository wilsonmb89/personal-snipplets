import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ProductsService } from '../../services-apis/products/products/products.service';
import { GetCardsRq, GetCardsRs, AccountList } from '../../services-apis/products/products/models/getCards.dto';
import { CustomerCard } from '../../../../app/models/activation-cards/customer-cards-list-rs';

@Injectable()
export class CardsInfoDelegateService {

  private readonly CONST_CUSTOMER_CARD_EXP_DATE = '2050-01-01T19:38:41.000+0000';

  constructor(
    private productsService: ProductsService
  ) {}

  public getCards(
    acctId?: string,
    acctType?: string,
    requireAllCards?: string,
    cardStatus?: string[]
  ): Observable<GetCardsRs> {
    const getCardsRq = new GetCardsRq(
      acctId || '',
      acctType || '',
      requireAllCards || '1',
      cardStatus || ['ALL']
    );
    return this.productsService.getCards(getCardsRq);
  }

  public getCardsMappedCustomerCard(
    acctId?: string,
    acctType?: string,
    requireAllCards?: string,
    cardStatus?: string[]
  ): Observable<CustomerCard[]> {
    return this.getCards(acctId, acctType, requireAllCards, cardStatus).map(
      (getCardsRs: GetCardsRs) => getCardsRs.accountList.map(
        (account: AccountList) => {
          const customerCard = new CustomerCard();
          customerCard.cardState = account.status;
          customerCard.cardNumber = account.productNumber;
          customerCard.lastDigits = this.getLastDigitsNumberCard(account.productNumber);
          customerCard.displayNumber = this.getLastDisplayNumberCard(customerCard.lastDigits);
          customerCard.expDate = this.CONST_CUSTOMER_CARD_EXP_DATE;
          customerCard.cardType = account.productBankType;
          customerCard.description = account.description;
          customerCard.lockId = account.lockId;
          return customerCard;
        }
      )
    );
  }

  private getLastDigitsNumberCard(cardNumber: string): string {
    const lastDigitsLength = 8;
    if (cardNumber.length > lastDigitsLength) {
      return cardNumber.substring(cardNumber.length - lastDigitsLength);
    }
    return cardNumber;
  }

  private getLastDisplayNumberCard(lastDigits: string): string {
    const lastDigitsLength = 4;
    if (lastDigits.length > lastDigitsLength) {
      return `****${lastDigits.substring(lastDigits.length - lastDigitsLength)}`;
    }
    return lastDigits;
  }

}
