import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import { UserFeatures } from './models/UserFeatures';
import { CatalogueRq, CatalogueRs } from './models/catalogue.model';

@Injectable()
export class UserFeaturesService {

  private readonly CONST_USER_FEATURES_URL = 'user-features';
  private readonly CONST_GET_USER_FEATURES_OP = 'get-user-settings';
  private readonly CONST_SAVE_USER_FEATURES_OP = 'user-settings';
  private readonly CONST_GET_CATALOG_OP = 'get-catalog';

  constructor(
    private bdbHttpClient: HttpClientWrapperProvider
  ) {}

  public getUserFeatures(): Observable<UserFeatures> {
    return this.bdbHttpClient
      .postToADLApi<any, UserFeatures>({}, `${this.CONST_USER_FEATURES_URL}/${this.CONST_GET_USER_FEATURES_OP}`);
  }

  public saveUserFeatures(userFeature: UserFeatures): Observable<UserFeatures>  {
    return this.bdbHttpClient
      .postToADLApi<UserFeatures, UserFeatures>(userFeature, `${this.CONST_USER_FEATURES_URL}/${this.CONST_SAVE_USER_FEATURES_OP}`);
  }

  public getCatalogues(catalogueRq: CatalogueRq): Observable<CatalogueRs> {
    return this.bdbHttpClient
      .postToADLApi<CatalogueRq, CatalogueRs>(catalogueRq, `${this.CONST_USER_FEATURES_URL}/${this.CONST_GET_CATALOG_OP}`);
  }

}
