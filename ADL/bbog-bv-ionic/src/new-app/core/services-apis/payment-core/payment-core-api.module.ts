import { NgModule } from '@angular/core';
import { PaymentCoreApiService } from './payment-core-api.service';
import { BdbHttpModule } from '../../../../new-app/core/http/bdb-http.module';

@NgModule({
    imports: [
        BdbHttpModule
    ],
    providers: [
        PaymentCoreApiService
    ]
})
export class PaymentCoreApiModule { }
