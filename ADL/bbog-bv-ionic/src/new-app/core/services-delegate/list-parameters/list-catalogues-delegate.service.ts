import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Catalogue, CatalogueRq } from '@app/apis/user-features/models/catalogue.model';
import { UserFeaturesService } from '@app/apis/user-features/user-features.service';
import { CatalogsEnum } from './enums/catalogs-enum';

@Injectable()
export class ListCataloguesDelegateProvider {

  constructor(
    private userFeaturesService: UserFeaturesService
  ) {
  }

  public getListCatalogs(catalogueType: CatalogsEnum, parentId: string): Observable<Array<Catalogue>> {
    return this.userFeaturesService.getCatalogues(this.buildCatalogueRq(catalogueType, parentId))
      .map(e => e.catalogItems);
  }

  private buildCatalogueRq(catalogueType: CatalogsEnum, parentId: string): CatalogueRq {
    return {
      catalogName: catalogueType,
      parentId: parentId
    };
  }
}

