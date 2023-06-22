import { Directive, Input, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[max-length-input]' // Attribute selector
})
export class MaxLengthInputDirective implements OnInit {

  @Input() maxlength: string;
  private keyValidator = [
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
    const el = this.elmRef.nativeElement as HTMLElement;
    el.addEventListener('inputKeyDown', (ev: CustomEvent) => {
      const lengthInput = ev.detail.srcElement.value.length;
      if (lengthInput === +this.maxlength && !this.keyValidator.some(e => e === ev.detail.key)) {
        document.onkeydown = () => false;
      }
    }, true);
    el.addEventListener('inputKeyUp', () => {
      document.onkeydown = e => e;
    });
  }

}
