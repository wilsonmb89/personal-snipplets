import { Directive, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[dbdNumberFormatter]' })
export class DbdNumberFormatterDirective {

  private regex: RegExp = new RegExp('[^0-9]');

  constructor(private control: NgControl, ) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
    if (event && event.key && event.key.match(this.regex) &&
      event.keyCode !== 8 && event.keyCode !== 9 &&
      event.keyCode !== 37 && event.keyCode !== 39 && event.keyCode !== 46) {
      event.preventDefault();
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let current: string = this.control.control.value || '';
    current = current.replace(/[^0-9]/g, '');
    // this.control.control.setValue(this.currencyPipe.transform(current, '$', 'symbol', '1.0-0'));
    this.control.control.setValue(current);
  }
}
