import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular/module';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { BdbSearchFilterComponent } from './bdb-search-filter';

@NgModule({
    declarations: [
      BdbSearchFilterComponent,
    ],
    imports: [
        IonicModule,
        DirectivesModule,
        ComponentsModule,
        PipesModule
    ],
    exports: [
      BdbSearchFilterComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class BdbSearchFilterModule { }
