import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import {NewAuthenticatorResponse, NewValPinRq} from '@app/apis/authenticator/models/authenticator.model';

@Injectable()
export class AuthenticatorApiService {

    private PATH_AUTH = 'authentication';

    constructor(
        private httpClientWrapper: HttpClientWrapperProvider
    ) { }

    public validateCredentials(rq: NewValPinRq): Observable<NewAuthenticatorResponse> {
        return this.httpClientWrapper.postToADLApi<NewValPinRq, NewAuthenticatorResponse>(
            rq, `${this.PATH_AUTH}/web-auth`
        );
    }

}
