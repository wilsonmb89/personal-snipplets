import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular/module';
import { BdbPocketCardDetail } from './bdb-pocket-card-detail';
import { DirectivesModule } from '../../../../directives/directives.module';
import { ComponentsModule } from '../../../components.module';
import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule({
    declarations: [
      BdbPocketCardDetail,
    ],
    imports: [
        IonicModule,
        DirectivesModule,
        ComponentsModule,
        PipesModule
    ],
    exports: [
      BdbPocketCardDetail
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class BdbPocketCardDetailModule { }
