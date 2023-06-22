import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecoverPasswordPage } from './recover-password';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    RecoverPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(RecoverPasswordPage),
    ComponentsModule,
  ],
})
export class RecoverPasswordPageModule {}
