import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[number-input]',
})
export class NumberInputDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.elementRef.nativeElement.value;
    this.elementRef.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (initalValue !== this.elementRef.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDownInput(event: KeyboardEvent): any | undefined {
    if (event.code === '229') {
      return;
    }
    if (event.key === 'Backspace') {
      return;
    }
    if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'Delete' ||
      event.key === 'Tab'
    ) {
      return;
    } else if (event.key.search(/\d/) === -1) {
      event.preventDefault();
    }
  }
}
