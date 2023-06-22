import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TxInProgressMainService } from './services/tx-in-progress-main.service';
import { TxInProgressMainComponent } from './tx-in-progress-main/tx-in-progress';
import { TxInProgressHeaderComponent } from './tx-in-progress-header/tx-in-progress-header';
import { BodyAmtPanelComponent } from './body-amt-panel/body-amt-panel';
import { BodyTitleDescItemComponent } from './body-title-desc-item/body-title-desc-item';
import { TxInProgressBodyComponent } from './tx-in-progress-body/tx-in-progress-body';

@NgModule({
  declarations: [
    TxInProgressMainComponent,
    TxInProgressHeaderComponent,
    TxInProgressBodyComponent,
    BodyAmtPanelComponent,
    BodyTitleDescItemComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    TxInProgressMainService
  ],
  exports: [
    TxInProgressMainComponent,
    TxInProgressHeaderComponent,
    TxInProgressBodyComponent,
    BodyAmtPanelComponent,
    BodyTitleDescItemComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TxInProgressModule {}
