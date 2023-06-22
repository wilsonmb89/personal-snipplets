import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[type-number-input]' // Attribute selector
})
export class TypeNumberInputDirective implements OnInit {

  private keyValidator = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Enter',
    'Shift',
    'Home',
    'End',
    'Tab'
    ];

  constructor(
    private elmRef: ElementRef
  ) { }

  ngOnInit(): void {
    const pulseInput = this.elmRef.nativeElement;
    pulseInput.addEventListener('inputKeyDown', (ev: CustomEvent) => {
      if (!this.keyValidator.some(e => e === ev.detail.key)) {
        document.onkeydown = () => false;
      }
    });
    pulseInput.addEventListener('inputKeyUp', () => {
      document.onkeydown = e => e;
    });
  }

}
