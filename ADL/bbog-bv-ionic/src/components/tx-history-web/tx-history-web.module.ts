import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular/module';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { TxHistoryWebComponent } from './tx-history-web';
import { BdbSearchFilterModule } from '../../components/bdb-search-filter/bdb-search-filter.module';

@NgModule({
    declarations: [
      TxHistoryWebComponent,
    ],
    imports: [
        IonicModule,
        DirectivesModule,
        ComponentsModule,
        PipesModule,
        BdbSearchFilterModule
    ],
    exports: [
      TxHistoryWebComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TxHistoryWebModule { }
