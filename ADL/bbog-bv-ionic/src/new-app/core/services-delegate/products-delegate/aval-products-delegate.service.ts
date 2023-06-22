import { Injectable } from '@angular/core';
import { AvalProductsService } from '@app/apis/products/aval-products/aval-products.service';
import { Observable } from 'rxjs/Observable';
import { ProductDetail } from '../../../../app/models/products/product-model';
import {
  ProductsInquiriesResponse,
  ProductsInquiriesRq
} from '@app/apis/products/aval-products/models/aval-products.model';
import { map } from 'rxjs/operators';


@Injectable()
export class AvalProductsDelegateService {

  constructor(private avalProductsService: AvalProductsService) {
  }


  public getAvalProducts(bankId: string): Observable<ProductDetail[]> {
    const request: ProductsInquiriesRq = {
      bankId
    };

    return this.avalProductsService.inquiries(request)
      .pipe(map((data: ProductsInquiriesResponse) => {

        return data.partyAcctRelRec.map(partyAcctRelRec => {

          let description = '';
          let amount = '';

          for (const prop in partyAcctRelRec.balanceDetail) {
            if (partyAcctRelRec.balanceDetail.hasOwnProperty(prop)) {
              description = prop;
              amount = partyAcctRelRec.balanceDetail[prop];
            }
          }

          return {
            productBank: null,
            bankId,
            isAval: null,
            productName: partyAcctRelRec.acctName,
            productType: partyAcctRelRec.acctType,
            productNumber: partyAcctRelRec.acctId,
            productNumberX: null,
            description,
            amount,
            isActive: null
          };
        });

      }));


  }

}
