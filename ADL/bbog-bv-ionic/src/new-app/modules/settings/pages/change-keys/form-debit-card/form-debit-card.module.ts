import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { GenericModalModule } from '@app/shared/components/modals/generic-modal/generic-modal.module';
import { ServiceApiErrorModalModule } from '@app/shared/components/modals/service-api-error-modal/service-api-error-modal.module';
import { IonicPageModule } from 'ionic-angular';
import { SettingsModule } from '../../../settings.module';
import { FormDebitCardPage } from './form-debit-card';

@NgModule({
    declarations: [
        FormDebitCardPage
    ],
    imports: [
        IonicPageModule.forChild(FormDebitCardPage),
        SettingsModule,
        FlowHeaderComponentModule,
        GenericModalModule,
        ServiceApiErrorModalModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class FormDebitCardPageModule { }
