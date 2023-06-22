import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../../components/components.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import { StatementDownloadPage } from './statement-download';
import { DirectivesModule } from '../../../../directives/directives.module';
import { DocumentsModule } from '@app/modules/documents/documents.module';
import { ServiceApiErrorModalModule } from '@app/shared/components/modals/service-api-error-modal/service-api-error-modal.module';

@NgModule({
  declarations: [
    StatementDownloadPage
  ],
  imports: [
    IonicPageModule.forChild(StatementDownloadPage),
    ComponentsModule,
    PipesModule,
    DirectivesModule,
    DocumentsModule,
    ServiceApiErrorModalModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatementDownloadPageModule {}
