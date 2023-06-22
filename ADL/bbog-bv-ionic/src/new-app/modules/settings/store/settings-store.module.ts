import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { CardsInfoEffect } from './effects/cards-info.effect';
import { CardsInfoFacade } from './facades/cards-info.facade';
import { CardsInfoDelegateService } from '@app/delegate/products-delegate/cards-info-delegate.service';
import { LimitsEffect } from '@app/modules/settings/store/effects/limits.effect';
import { LimitsFacade } from '@app/modules/settings/store/facades/limits.facade';

@NgModule({
  imports: [
    EffectsModule.forFeature([CardsInfoEffect]),
    EffectsModule.forFeature([LimitsEffect])
  ],
  providers: [
    CardsInfoDelegateService,
    CardsInfoFacade,
    LimitsFacade
  ]
})
export class SettingsStoreModule { }
