import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificateSelectPage } from '../../../pages/documents/certificate/certificate-select/certificate-select';
import { CertificateSelectPageModule } from '../../../pages/documents/certificate/certificate-select/certificate-select.module';
import { StatementSelectPage } from '../../../pages/documents/statement/statement-select/statement-select';
import { StatementSelectPageModule } from '../../../pages/documents/statement/statement-select/statement-select.module';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { DocsOpsMenuProvider } from '../../../providers/docs-ops-menu/docs-ops-menu';
import { DocsMenuPage } from './docs-menu';
import {ReferencesSelectAccountPageModule} from '../../documents/references/references-select-account/references-select-account.module';

@NgModule({
  declarations: [
    DocsMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(DocsMenuPage),
    DirectivesModule,
    ComponentsModule,
    StatementSelectPageModule,
    CertificateSelectPageModule,
    ReferencesSelectAccountPageModule
  ],
  providers: [
    DocsOpsMenuProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    StatementSelectPage,
    CertificateSelectPage
  ]
})
export class DocsMenuPageModule {}
