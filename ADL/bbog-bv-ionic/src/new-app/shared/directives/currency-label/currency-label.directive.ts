import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ElementRef } from '@angular/core/';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';

@Directive({
  selector: '[currencyLabelDirective]'
})
export class CurrencyLabelDirective implements OnChanges {

  @Input() currencyLabelDirective: string;

  constructor(private elem: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const parts = CurrencyFormatPipe.format(this.currencyLabelDirective).split('.');
    const sup = !!parts[1] ? '<sup>.' + parts[1] + '</sup>' : '';
    this.elem.nativeElement.innerHTML += parts[0] +  sup;
  }
}
