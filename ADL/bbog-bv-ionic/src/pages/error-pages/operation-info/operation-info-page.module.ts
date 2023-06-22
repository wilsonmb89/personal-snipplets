import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OperationInfoPage } from './operation-info-page';
import { DirectivesModule } from '../../../directives/directives.module';
import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [
    OperationInfoPage
  ],
  imports: [
    IonicPageModule.forChild(OperationInfoPage),
    DirectivesModule,
    ComponentsModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OperationInfoPageModule {}
