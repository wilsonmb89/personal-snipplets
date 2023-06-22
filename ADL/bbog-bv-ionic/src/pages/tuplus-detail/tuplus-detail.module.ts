import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TuplusDetailPage } from './tuplus-detail';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { BdbCardDetailModule } from '../../components/core/molecules/bdb-card-detail';
import { TxHistoryWebModule } from '../../components/tx-history-web/tx-history-web.module';

@NgModule({
  declarations: [
    TuplusDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TuplusDetailPage),
    ComponentsModule,
    DirectivesModule,
    BdbCardDetailModule,
    TxHistoryWebModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TuplusDetailPageModule { }
