import { NgModule } from '@angular/core';
import { SettingsPage } from './settings';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { IdentityValidationDelegateModule } from '@app/delegate/identity-validation-delegate/identity-validation-delegate.module';
import { CustomerBasicDataDelegateModule } from '@app/delegate/customer-basic-data-delegate/customer-basic-data-delegate.module';

@NgModule({
    declarations: [SettingsPage],
    imports: [
        IonicPageModule.forChild(SettingsPage),
        ComponentsModule,
        IdentityValidationDelegateModule,
        CustomerBasicDataDelegateModule
    ]
})

export class SettingsPageModule { }
