import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular/module';
import { ComponentsModule } from '../components.module';
import { PocketCardComponent } from './pocket-card';

@NgModule({
    declarations: [
        PocketCardComponent
    ],
    imports: [
        IonicModule,
        ComponentsModule
    ],
    exports: [
        PocketCardComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class PocketCardModule { }
