import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EnrollCustomCardRq, GenericResponse } from '@app/apis/products/products/models/products';
import { ProductsService } from '@app/apis/products/products/products.service';

@Injectable()
export class EnrollCustomCardDelegateService {

  constructor(
    private productsService: ProductsService
  ) {
  }

  public enrollCustomCard(enrollCustomCardRq: EnrollCustomCardRq): Observable<GenericResponse> {
    return this.productsService.enrollCustomCard(enrollCustomCardRq);
  }
}
