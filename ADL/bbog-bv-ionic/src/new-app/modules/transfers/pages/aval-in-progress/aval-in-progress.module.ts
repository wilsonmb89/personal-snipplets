import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TxInProgressModule } from '@app/shared/components/tx-in-progress/tx-in-progress.module';
import { AvalInProgressPage } from './aval-in-progress';
import { NewPipesModule } from '@app/shared/pipes/new-pipes.module';

@NgModule({
  declarations: [
    AvalInProgressPage
  ],
    imports: [
        IonicPageModule.forChild(AvalInProgressPage),
        CommonModule,
        TxInProgressModule,
        NewPipesModule
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class TxInProgressPageModule {}
