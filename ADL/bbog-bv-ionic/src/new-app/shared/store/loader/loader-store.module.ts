import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import {LoaderEffects} from './effects/loader.effect';


@NgModule({
  imports: [
    EffectsModule.forFeature([LoaderEffects]),
  ],
  providers: [],
})
export class LoaderStoreModule {}
