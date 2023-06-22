import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PocketAccountPage } from './pocket-account';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { DirectivesModule } from '../../../../../../../directives/directives.module';
import {PocketSameCategoryComponent} from '../../../components/pocket-same-category/pocket-same-category';
import {PocketsModalsModule} from '../../../components/pockets-modals.module';

@NgModule({
  declarations: [
    PocketAccountPage
  ],
  imports: [
    IonicPageModule.forChild(PocketAccountPage),
    ComponentsModule,
    DirectivesModule,
    PocketsModalsModule
  ],
  entryComponents: [
    PocketSameCategoryComponent

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PocketAccountPageModule {}
