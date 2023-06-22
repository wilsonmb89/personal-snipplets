import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PocketManagePage } from './pocket-manage';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { DirectivesModule } from '../../../../../../../directives/directives.module';
import { PocketOpsService } from '../../../services/pocket-ops.service';
import { PipesModule } from '../../../../../../../pipes/pipes.module';
import {PocketsModalsModule} from '../../../components/pockets-modals.module';
import { NumberInputDirective } from '@app/shared/directives/number-input/number-input';

@NgModule({
  declarations: [
    PocketManagePage,
    NumberInputDirective
  ],
  imports: [
    IonicPageModule.forChild(PocketManagePage),
    ComponentsModule,
    DirectivesModule,
    PipesModule,
    PocketsModalsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    PocketOpsService
  ]
})
export class PocketManagePageModule {}
