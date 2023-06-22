import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PocketBuildingPage } from './pocket-building';
import { PocketOpsService } from '../../../services/pocket-ops.service';


@NgModule({
  declarations: [
    PocketBuildingPage,
  ],
  imports: [
    IonicPageModule.forChild(PocketBuildingPage),
  ],
  providers: [
    PocketOpsService
  ]
})
export class PocketBuildingPageModule {}
