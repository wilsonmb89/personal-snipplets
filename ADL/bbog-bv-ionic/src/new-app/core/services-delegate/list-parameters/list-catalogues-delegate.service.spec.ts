import { ListCataloguesDelegateProvider } from './list-catalogues-delegate.service';
import { TestBed } from '@angular/core/testing';
import { UserFeaturesService } from '@app/apis/user-features/user-features.service';
import { CatalogueRs } from '@app/apis/user-features/models/catalogue.model';
import { of } from 'rxjs/observable/of';
import { CatalogsEnum } from './enums/catalogs-enum';


let listCataloguesDelegateProvider: ListCataloguesDelegateProvider;


describe('ListCataloguesDelegateProvider', () => {

  const userFeaturesServiceMock = jasmine.createSpyObj('UserFeaturesService', ['getCatalogues']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListCataloguesDelegateProvider,
        {
          provide: UserFeaturesService,
          useValue: userFeaturesServiceMock
        }
      ]
    }).compileComponents();

    listCataloguesDelegateProvider = TestBed.get(ListCataloguesDelegateProvider);

  });


  it('getListCatalogs should return list of catalog', (done) => {

    const mock: CatalogueRs = {
      catalogItems: [
        {
          id: 'x',
          name: 'x',
          parentId: 'x'
        }
      ]
    };

    userFeaturesServiceMock.getCatalogues.and.returnValue(of(mock));

    const result = listCataloguesDelegateProvider.getListCatalogs(CatalogsEnum.CONVENIOS_DONACIONES, '');

    expect(result).toBeTruthy();

    result.subscribe((data) => {
      expect(data).toEqual(mock.catalogItems);
      done();
    });

  });


});
