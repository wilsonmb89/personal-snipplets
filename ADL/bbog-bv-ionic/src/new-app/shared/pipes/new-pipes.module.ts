import { NgModule } from '@angular/core';
import { ContractionAvatarPipe } from './contraction/contraction-avatar.pipe';
import { Mask4LastDigitsPipe } from '@app/shared/pipes/Mask4LastDigits.pipe';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';
import {CapitalizeCasePipe} from '@app/shared/pipes/CapitalizeCase.pipe';

@NgModule({
  declarations: [
    ContractionAvatarPipe,
    Mask4LastDigitsPipe,
    CurrencyFormatPipe,
    CapitalizeCasePipe
  ],
  exports: [
    ContractionAvatarPipe,
    Mask4LastDigitsPipe,
    CurrencyFormatPipe,
    CapitalizeCasePipe
  ]
})
export class NewPipesModule {
}
