import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ComponentsModule} from '../../../../components/components.module';
import {BdbItemCardSimplifiedModule} from '../../../../components/bdb-references-generate-card/bdb-references-generate-card.module';
import {DirectivesModule} from '../../../../directives/directives.module';
import {ReferencesGeneratePage} from './references-generate';
import { ServiceApiErrorModalModule } from '@app/shared/components/modals/service-api-error-modal/service-api-error-modal.module';

@NgModule({
  declarations: [
    ReferencesGeneratePage
  ],
  imports: [
    IonicPageModule.forChild(ReferencesGeneratePage),
    ComponentsModule,
    BdbItemCardSimplifiedModule,
    DirectivesModule,
    ServiceApiErrorModalModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReferencesGeneratePageModule {}
