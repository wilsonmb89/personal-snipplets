import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import { BankStatementRequest, GetAccountStatementRs } from './models/account-statement.model';
import { GetStatementPeriodRq, GetStatementPeriodRs } from './models/statement-period.model';

@Injectable()
export class BankingReportsApiService {

    private PATH_BANKING_REPORTS = 'banking-reports';

    constructor(
        private httpClientWrapper: HttpClientWrapperProvider
    ) { }

    public getAccountStatement(rq: BankStatementRequest): Observable<GetAccountStatementRs> {
        return this.httpClientWrapper.postToADLApi<BankStatementRequest, GetAccountStatementRs>(
            rq, `${this.PATH_BANKING_REPORTS}/statements`
        );
    }

    public getTaxCertificate(rq: BankStatementRequest): Observable<GetAccountStatementRs> {
        return this.httpClientWrapper.postToADLApi<BankStatementRequest, GetAccountStatementRs>(
            rq, `${this.PATH_BANKING_REPORTS}/tax-certificates`
        );
    }

    public getStatementPeriods(rq: GetStatementPeriodRq): Observable<GetStatementPeriodRs> {
        return this.httpClientWrapper.postToADLApi<GetStatementPeriodRq, GetStatementPeriodRs>(
            rq, `${this.PATH_BANKING_REPORTS}/periods`
        );
    }

}
