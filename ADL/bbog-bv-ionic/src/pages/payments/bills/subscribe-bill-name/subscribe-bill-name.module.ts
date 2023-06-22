import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscribeBillNamePage } from './subscribe-bill-name';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import {ListParametersDelegateModule} from '../../../../new-app/core/services-delegate/list-parameters/list-parameters-delegate.module';

@NgModule({
  declarations: [
    SubscribeBillNamePage,
  ],
  imports: [
    IonicPageModule.forChild(SubscribeBillNamePage),
    ComponentsModule,
    DirectivesModule,
    ListParametersDelegateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SubscribeBillNamePageModule {}
