import { NgModule } from '@angular/core';

import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { CustomerSecurityModule } from '@app/apis/customer-security/customer-security.module';
import { DebitCardActivationDelegateService } from './debit-card-activation-delegate.service';
import { DebitCardLockDelegateService } from './debit-card-lock-delegate.service';
import { GetLimitsNalAccDelegateService } from './get-limits-nal-acc-delegate.service';
import { UpdateLimitsNalAccDelegateService } from './update-limits-nal-acc-delegate.service';
import { GetLimitsDelegateService } from './get-limits-delegate.service';
import { UpdateLimitsDelegateService } from './update-limits-delegate.service';
import { DebitCardBandActivationDelegateService } from '@app/delegate/customer-security-delegate/debit-card-band-activation-delegate.service';

@NgModule({
  declarations: [],
  imports: [
    CustomerSecurityModule,
    BdbUtilsModule

  ],
  providers: [
    DebitCardActivationDelegateService,
    DebitCardLockDelegateService,
    GetLimitsNalAccDelegateService,
    UpdateLimitsNalAccDelegateService,
    GetLimitsDelegateService,
    UpdateLimitsDelegateService,
    DebitCardBandActivationDelegateService
  ]
})
export class CustomerSecurityDelegateModule {}
