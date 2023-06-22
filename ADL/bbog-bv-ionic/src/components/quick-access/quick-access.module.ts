import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular/module';
import { ComponentsModule } from '../components.module';
import { QuickAccessComponent } from './quick-access';
import {ListParametersDelegateModule} from '@app/delegate/list-parameters/list-parameters-delegate.module';

@NgModule({
    declarations: [
        QuickAccessComponent
    ],
    imports: [
        IonicModule,
        ComponentsModule,
        ListParametersDelegateModule
    ],
    exports: [
        QuickAccessComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class QuickAccessModule { }
