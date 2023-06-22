import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { BalancesEffects } from './effects/balances.effect';
import { DigitalCDTBalancesEffects } from './effects/digital-cdt-balances.effect';
import { DigitalCDTRenewalEffects } from './effects/digital-cdt-renewal.effect';
import { ProductsEffects } from './effects/products.effect';
import { CreditCardEffect } from './effects/credit-card.effect';
import { ProductsFacade } from './facades/products.facade';
import { CreditCardFacade } from './facades/credit-card.facade';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      ProductsEffects,
      BalancesEffects,
      DigitalCDTBalancesEffects,
      DigitalCDTRenewalEffects,
      CreditCardEffect
    ]),
  ],
  providers: [ProductsFacade, CreditCardFacade],
})
export class ProductsStoreModule {}
