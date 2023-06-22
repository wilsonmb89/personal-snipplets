import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { IonicPageModule } from 'ionic-angular';
import { EnrolledPage } from '@app/shared/components/campaigns/cards-campaign/pages/enrroled/enrolled';

@NgModule({
  declarations: [
    EnrolledPage
  ],
  providers: [
  ],
  imports: [
    IonicPageModule.forChild(EnrolledPage),
    FlowHeaderComponentModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class EnrolledModule {
}
