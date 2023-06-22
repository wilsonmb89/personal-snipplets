import { AvalProductsService } from '@app/apis/products/aval-products/aval-products.service';
import {
  ProductsInquiriesResponse,
  ProductsInquiriesRq
} from '@app/apis/products/aval-products/models/aval-products.model';
import { TestBed } from '@angular/core/testing';
import { buildMockResponse, expectObject, mockHttpClientInfo } from '@app/apis/services-apis.spec';


let avalProductsService: AvalProductsService;

describe('AvalProductsService', () => {


  beforeEach(() => {
    TestBed.configureTestingModule(
      {providers: [AvalProductsService, mockHttpClientInfo]})
      .compileComponents();
    avalProductsService = TestBed.get(AvalProductsService);
  });


  it('should post request', (done) => {
    const mock: ProductsInquiriesResponse = {
      partyAcctRelRec: []
    };

    buildMockResponse(mock);

    const request: ProductsInquiriesRq = {
      bankId: '123'
    };
    const result = avalProductsService.inquiries(request);

    expectObject(result, mock, done);

  });

});
