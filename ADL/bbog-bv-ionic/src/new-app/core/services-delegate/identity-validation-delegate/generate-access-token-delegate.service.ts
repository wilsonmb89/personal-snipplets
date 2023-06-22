import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GetAccessTokenRs } from '../../services-apis/identity-validation/models/generate-access-token.model';
import { ValidationApiService } from '../../services-apis/identity-validation/validation-api.service';

@Injectable()
export class GenerateAccessTokenDelegateService {

  constructor(
    private validationApiService: ValidationApiService
  ) {}

  public generateAccessToken(): Observable<GetAccessTokenRs> {
    return this.validationApiService.generateAccessToken();
  }

}
