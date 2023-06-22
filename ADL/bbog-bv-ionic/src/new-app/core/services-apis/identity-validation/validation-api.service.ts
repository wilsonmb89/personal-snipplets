import { Injectable } from '@angular/core';
import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import { Observable } from 'rxjs/Observable';
import { LastLoginRs } from './models/last-login.model';
import { GetAccessTokenRs } from './models/generate-access-token.model';
import {TokenInfoRs, ValidateOtpTokenRq, ValidateOtpTokenRs} from './models/token.model';
import {ValDispatcherRq, ValDispatcherRs} from '@app/apis/identity-validation/models/val-dispatcher.model';


@Injectable()
export class ValidationApiService {

    private PATH_VALIDATION = 'validation';

    constructor(
        private httpClientWrapperProvider: HttpClientWrapperProvider
    ) { }

    public getLastLogin(): Observable<LastLoginRs> {
        return this.httpClientWrapperProvider.postToADLApi({}, `${this.PATH_VALIDATION}/last-login`);
    }

    public generateAccessToken(): Observable<GetAccessTokenRs> {
        return this.httpClientWrapperProvider.postToADLApi<any, GetAccessTokenRs>({}, `${this.PATH_VALIDATION}/access-token`);
    }

    public getTokenInfo(): Observable<TokenInfoRs> {
        return this.httpClientWrapperProvider.postToADLApi({}, `${this.PATH_VALIDATION}/token/info`);
    }

    public validateOtpToken(validateOtpTokenRq: ValidateOtpTokenRq): Observable<ValidateOtpTokenRs> {
        return this.httpClientWrapperProvider.postToADLApi(validateOtpTokenRq, `${this.PATH_VALIDATION}/validate-otp`);
    }

    public dispatch(valDispatcherRq: ValDispatcherRq): Observable<ValDispatcherRs> {
        return this.httpClientWrapperProvider.postToADLApi(valDispatcherRq, `${this.PATH_VALIDATION}/authentication-dispatcher`);
    }
}
