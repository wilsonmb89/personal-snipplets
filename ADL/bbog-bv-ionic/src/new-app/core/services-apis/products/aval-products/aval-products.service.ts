import { Injectable } from '@angular/core';
import { HttpClientWrapperProvider } from '../../../http/http-client-wrapper/http-client-wrapper.service';
import {
  ProductsInquiriesResponse,
  ProductsInquiriesRq
} from '@app/apis/products/aval-products/models/aval-products.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AvalProductsService {


  private AVAL_PRODUCTS = 'aval-products';

  constructor(
    private httpClientWrapperProvider: HttpClientWrapperProvider
  ) {
  }

  public inquiries(request: ProductsInquiriesRq): Observable<ProductsInquiriesResponse> {
    return this.httpClientWrapperProvider
      .postToADLApi<ProductsInquiriesRq, ProductsInquiriesResponse>(request, `${this.AVAL_PRODUCTS}/inquiries`);
  }

}
