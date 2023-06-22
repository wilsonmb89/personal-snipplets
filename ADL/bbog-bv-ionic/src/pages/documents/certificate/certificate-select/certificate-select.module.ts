import { NgModule, Directive } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificateSelectPage } from './certificate-select';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    CertificateSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(CertificateSelectPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class CertificateSelectPageModule {}
