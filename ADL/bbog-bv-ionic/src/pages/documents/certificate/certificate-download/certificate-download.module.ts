import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificateDownloadPage } from './certificate-download';
import { ComponentsModule } from '../../../../components/components.module';
import { DocumentsModule } from '@app/modules/documents/documents.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { ServiceApiErrorModalModule } from '@app/shared/components/modals/service-api-error-modal/service-api-error-modal.module';

@NgModule({
  declarations: [
    CertificateDownloadPage
  ],
  imports: [
    IonicPageModule.forChild(CertificateDownloadPage),
    ComponentsModule,
    DocumentsModule,
    DirectivesModule,
    ServiceApiErrorModalModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CertificateDownloadPageModule { }
