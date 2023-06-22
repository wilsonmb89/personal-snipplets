import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import { IonicPageModule } from 'ionic-angular';
import { SettingsModule } from '../../../settings.module';
import { ChangeKeysPage } from './change-keys';

@NgModule({
    declarations: [
        ChangeKeysPage
    ],
    imports: [
        IonicPageModule.forChild(ChangeKeysPage),
        SettingsModule,
        FlowHeaderComponentModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ChangeKeysPageModule { }
