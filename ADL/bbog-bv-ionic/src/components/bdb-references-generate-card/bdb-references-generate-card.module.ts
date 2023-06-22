import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular/module';
import {DirectivesModule} from '../../directives/directives.module';
import {ComponentsModule} from '../components.module';
import {PipesModule} from '../../pipes/pipes.module';
import {BdbReferencesGenerateCardComponent} from './bdb-references-generate-card';

@NgModule({
  declarations: [
    BdbReferencesGenerateCardComponent
  ],
  imports: [
    IonicModule,
    DirectivesModule,
    ComponentsModule,
    PipesModule
  ],
  exports: [
    BdbReferencesGenerateCardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class BdbItemCardSimplifiedModule {
}
