import { Injectable } from '@angular/core';
import { BankingReportsApiService } from '@app/apis/banking-reports/banking-reports-api.service';
import { BankStatementRequest } from '@app/apis/banking-reports/models/account-statement.model';
import { Observable } from 'rxjs/Observable';
import { ProductExtractsRs } from '../../../../app/models/extracts/product-extracts-response';

@Injectable()
export class TaxCertificateDelegateService {

    constructor(
        private bankingReportsApiService: BankingReportsApiService
    ) { }

    public getCertificate(extractRq: BankStatementRequest): Observable<ProductExtractsRs> {
            return this.bankingReportsApiService
            .getTaxCertificate(extractRq)
            .map(rs => {
                return {
                    binLength: '',
                    binData: rs.binData,
                    statusDesc: rs.statusDesc
                };
            });
    }
}
