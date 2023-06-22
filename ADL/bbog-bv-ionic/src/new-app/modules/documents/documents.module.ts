import { NgModule } from '@angular/core';
import { BankingReportsApiService } from '@app/apis/banking-reports/banking-reports-api.service';
import { AccountStatementDelegateService } from '@app/delegate/documents/account-statement-delegate.service';
import { TaxCertificateDelegateService } from '@app/delegate/documents/tax-certificate-delegate.service';
import { HttpClientWrapperProvider } from '../../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';

@NgModule({
    providers: [
        HttpClientWrapperProvider,
        BankingReportsApiService,
        TaxCertificateDelegateService,
        AccountStatementDelegateService
    ]
})
export class DocumentsModule { }
