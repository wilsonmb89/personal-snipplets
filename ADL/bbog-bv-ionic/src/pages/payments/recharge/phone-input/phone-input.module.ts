import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhoneInputPage } from './phone-input';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    PhoneInputPage,
  ],
  imports: [
    IonicPageModule.forChild(PhoneInputPage),
    ComponentsModule,
    DirectivesModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PhoneInputPageModule {}
