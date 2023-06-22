import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { RechargeChoicePage } from './recharge-choice';
import { RechargeRepoService } from '@app/modules/payments/services/recharge-repo.service';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';

@NgModule({
  declarations: [
    RechargeChoicePage
  ],
  imports: [
    IonicPageModule.forChild(RechargeChoicePage),
    BdbUtilsModule,
  ],
  providers: [
    RechargeRepoService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RechargeChoicePageModule {}
