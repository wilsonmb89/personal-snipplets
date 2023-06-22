import { NgModule } from '@angular/core';
import { BdbHttpModule } from '../../../new-app/core/http/bdb-http.module';
import { TransferCoreService } from '../../../new-app/core/services-apis/transfer/transfer-core/transfer-core.service';
import { EffectsModule } from '@ngrx/effects';
import { PaymentCoreApiService } from '../../../new-app/core/services-apis/payment-core/payment-core-api.service';
import { BillOpsProvider } from '../../../providers/bill-ops/bill-ops';
import { CCObligationsEffect } from './store/effects/cc-obligations.effect';
import { BillersPaymentEffect } from './store/effects/billers-payment.effect';
import { CCObligationsFacade } from './store/facades/cc-obligations.facade';
import { BillersPaymentFacade } from './store/facades/billers-payment.facade';
import { CCobligationsService } from './services/cc-obligations.service';
import { ACObligationsEffect } from './store/effects/ac-obligations-effect';
import { AcObligationsFacade } from './store/facades/ac-obligations.facade';
import { BillersPaymentService } from './services/billers-payment.service';
import { PaymentNonBillersApiService } from '@app/apis/payment-nonbillers/payment-nonbillers-api.service';
import { ObligationPaymentsService } from './services/obligation-payments.service';
import { SubscribeObligationService } from './services/subscribe-obligations.service';
import { TransactionResultPaymentsModule } from '@app/shared/modules/transaction-result/services/payments/transaction-result-payments.module';
import { GetBillService } from './services/get-bill.service';
import { PaymentBillersApiService } from '@app/apis/payment-billers/payment-billers-api.service';
import {DeleteObligationService} from './services/delete-obligations.service';
import {ExtraordinaryPaymentService} from './services/extraordinary-payment.service';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      CCObligationsEffect,
      BillersPaymentEffect,
      ACObligationsEffect
    ]),
    BdbHttpModule,
    TransactionResultPaymentsModule,
  ],
  providers: [
    CCObligationsFacade,
    TransferCoreService,
    BillersPaymentService,
    PaymentCoreApiService,
    BillersPaymentFacade,
    BillOpsProvider,
    CCobligationsService,
    PaymentNonBillersApiService,
    ObligationPaymentsService,
    SubscribeObligationService,
    AcObligationsFacade,
    GetBillService,
    PaymentBillersApiService,
    DeleteObligationService,
    ExtraordinaryPaymentService
  ]
}) export class PaymentsModule { }
