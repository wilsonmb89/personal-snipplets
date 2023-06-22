import { NgModule } from '@angular/core';
import { SafePipe } from './safe/safe';
import { TruncateDotsPipe } from './trunk-dots.pipe';
import { PeriodPipe } from './period/period';
import { CustomCurrencyPipe } from './custom-currency';
@NgModule({
  declarations: [SafePipe, TruncateDotsPipe, PeriodPipe, CustomCurrencyPipe],
  imports: [],
  exports: [SafePipe, TruncateDotsPipe, PeriodPipe, CustomCurrencyPipe]
})
export class PipesModule {}
