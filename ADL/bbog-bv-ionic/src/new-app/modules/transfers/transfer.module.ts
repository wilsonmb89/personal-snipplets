import { NgModule } from '@angular/core';
import { PaymentNonBillersApiService } from '@app/apis/payment-nonbillers/payment-nonbillers-api.service';
import { BdbHttpModule } from '../../../new-app/core/http/bdb-http.module';
import { TransferCoreService } from '../../../new-app/core/services-apis/transfer/transfer-core/transfer-core.service';
import { DonationsService } from './services/donations.service';
import { SubscribeTransferAcctService } from './services/subscribe-transfer-acct.service';

@NgModule({
    imports: [
        BdbHttpModule
    ],
    providers: [
        TransferCoreService,
        SubscribeTransferAcctService,
        DonationsService,
        PaymentNonBillersApiService
    ]
})

export class TransfersModule { }
