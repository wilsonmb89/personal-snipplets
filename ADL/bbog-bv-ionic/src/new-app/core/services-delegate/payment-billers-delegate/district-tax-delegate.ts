import { Injectable } from '@angular/core';
import { PaymentBillersApiService } from '@app/apis/payment-billers/payment-billers-api.service';
import { Observable } from 'rxjs/Observable';
import { Bill, ProviderPila } from 'app/models/pay/pila';
import { map } from 'rxjs/operators';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { Cities } from 'app/models/pay/tax';

@Injectable()
export class DistrictTaxDelegateService {
  constructor(private paymentBillersApiService: PaymentBillersApiService) {
  }

  public getDistrictTaxCities(): Observable<Cities> {
    return this.paymentBillersApiService.getDistrictTaxCities().pipe(
      map(res => ({ error: null, cities: res.map(item => ({ code: item.cityId, name: item.city })) }))
    );
  }

  public getDistrictTaxAgreements(cityId: string): Observable<ProviderPila> {
    return this.paymentBillersApiService.getDistrictTaxAgreements(cityId).pipe(
      map(res => ({ error: null, taxes: res.map(item => ({
          orgIdNum: item.taxId,
          name: item.taxName,
          svcId: null,
          bankId: null,
        }))
      }))
    );
  }

  public getDistrictTax(billNum: string, orgId: string): Observable<Bill> {
    return this.paymentBillersApiService.getDistrictTax({ billNum, orgId }).pipe(
        map(districtTaxResponse => (
            {...districtTaxResponse, extDate: districtTaxResponse.expirationDate}
        ))
    );
  }

  public payDistrictTax(productDetailApi: ApiProductDetail, bill: Bill): Observable<any> {
    return this.paymentBillersApiService.payDistrictTax({
        account: {
            accountNumber: productDetailApi.productNumber,
            accountType: productDetailApi.productBankType,
        },
        amount: `${bill.amount}`,
        codeService: bill.orgInfoName,
        taxFormNum: bill.invoiceNum
    });
  }
}
