import { TestBed } from '@angular/core/testing';
import { AvalProductsService } from '@app/apis/products/aval-products/aval-products.service';
import { ProductsInquiriesResponse } from '@app/apis/products/aval-products/models/aval-products.model';
import { AvalProductsDelegateService } from './aval-products-delegate.service';
import { of } from 'rxjs/observable/of';


let avalProductsDelegateService: AvalProductsDelegateService;

describe('AvalProductsDelegate', () => {

  const avalProductsServiceMock = jasmine.createSpyObj('AvalProductsService', ['inquiries']);


  beforeEach(() => {
    TestBed.configureTestingModule(
      {providers: [AvalProductsDelegateService, {provide: AvalProductsService, useValue: avalProductsServiceMock}]})
      .compileComponents();
    avalProductsDelegateService = TestBed.get(AvalProductsDelegateService);
  });


  it('Inquiries should return data mapped', (done) => {

    const mock: ProductsInquiriesResponse = {
      partyAcctRelRec: [{
        acctId: '111',
        acctName: 'name',
        acctType: 'dd',
        balanceDetail: {
          'key': 'xx'
        }

      }]
    };

    const lengthMockResponse = mock.partyAcctRelRec.length;

    avalProductsServiceMock.inquiries.and.returnValue(of(mock));

    const result = avalProductsDelegateService.getAvalProducts('0');
    expect(result).toBeTruthy();

    result.subscribe(value => {
      expect(value.length).toEqual(lengthMockResponse);
      expect(value[0].productNumber).toEqual(mock.partyAcctRelRec[0].acctId);
      expect(value[0].productType).toEqual(mock.partyAcctRelRec[0].acctType);
      expect(value[0].productName).toEqual(mock.partyAcctRelRec[0].acctName);
      done();
    });

  });

});
