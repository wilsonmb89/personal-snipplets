import { Injectable } from '@angular/core';
import { BankingReportsApiService } from '@app/apis/banking-reports/banking-reports-api.service';
import { BankStatementRequest } from '@app/apis/banking-reports/models/account-statement.model';
import { GetStatementPeriodRq, ListRangeDto } from '@app/apis/banking-reports/models/statement-period.model';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ProductExtractsRq } from '../../../../app/models/extracts/product-extracts-request';
import { ProductExtractsRs } from '../../../../app/models/extracts/product-extracts-response';

@Injectable()
export class AccountStatementDelegateService {

    private DOC_FORMAT = 'PDF';

    constructor(
        private bankingReportsApiService: BankingReportsApiService
    ) { }

    public getStatement(extractRq: ProductExtractsRq): Observable<ProductExtractsRs> {

        const bankStatementRq: BankStatementRequest = {
            acctId: extractRq.acctId,
            acctType: extractRq.acctType,
            docFormat: this.DOC_FORMAT,
            startDate: extractRq.startDate
        };

        return this.bankingReportsApiService
            .getAccountStatement(bankStatementRq)
            .map(rs => {
                return {
                    statusDesc: rs.statusDesc,
                    binData: rs.binData,
                    binLength: ''
                };
            });
    }

    public getPeriods(extractRq: ProductExtractsRq): Observable<ListRangeDto[]> {

        const statementPeriodRq: GetStatementPeriodRq = {
            acctId: extractRq.acctId,
            acctType: extractRq.acctType
        };

        return this.bankingReportsApiService
            .getStatementPeriods(statementPeriodRq)
            .pipe(map(rs => rs.rangeDt));
    }

}
