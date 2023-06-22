import { NgModule } from '@angular/core';
import { CurrencyLabelDirective } from '@app/shared/directives/currency-label/currency-label.directive';
import { MaxLengthInputDirective } from '@app/shared/directives/max-length-input/max-length-input';
import { TypeNumberInputDirective } from '@app/shared/directives/type-number-input/type-number-input';

@NgModule({
  declarations: [
    MaxLengthInputDirective,
    TypeNumberInputDirective,
    CurrencyLabelDirective
  ],
  exports: [
    MaxLengthInputDirective,
    TypeNumberInputDirective,
    CurrencyLabelDirective
  ]
})
export class NewDirectivesModule {
}
