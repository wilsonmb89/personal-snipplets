import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PocketDetailPage } from './pocket-detail';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { DirectivesModule } from '../../../../../../../directives/directives.module';
import { PocketOpsService } from '../../../services/pocket-ops.service';
import { BdbPocketCardDetailModule } from '../../../../../../../components/core/molecules/bdb-pocket-card-detail';

@NgModule({
  declarations: [
    PocketDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PocketDetailPage),
    ComponentsModule,
    DirectivesModule,
    BdbPocketCardDetailModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    PocketOpsService
  ]
})
export class PocketDetailPageModule { }
