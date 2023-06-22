
import { Component, Input, forwardRef, OnInit, ViewChild, ElementRef, Renderer2, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BdbMaskProvider } from '../../../providers/bdb-mask/bdb-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { MaskType } from '../../../providers/bdb-mask/bdb-mask-type.enum';

@Component({
  selector: 'bdb-currency-input',
  template:
    `
  <input
  type="tel"
  bdb-form-input
  id="cur-inp{{elementId}}"
  [placeholder]="placeHolder"
  (input)="onInputChange($event)"
  (blur)="onBlur()"
  [value]="inputValue"
  (keyup)="onKeyup($event)"
  [autocomplete]="autocomplete"
  [textMask]="{mask: customMask, guide: false}"
  #curInput>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BdbCurrencyInputComponent),
      multi: true
    }
  ]
})
export class BdbCurrencyInputComponent implements ControlValueAccessor, OnInit {

  private inputValue = '';
  private mFocus;

  @Input() placeHolder = '';
  @Input() selectOnFocus = false;
  @Input() elementId = '1';
  @Input() autocomplete = 'on';
  @Input() locale = 'es-CO';
  @Output() onVerifyChange = new EventEmitter();
  @Output() mFocusHasChanged: EventEmitter<boolean> = new EventEmitter;
  public set mFocused(mfocus: boolean) {
    this.mFocus = mfocus;
    if (mfocus) {
      this.setFocus();
    }
    this.mFocusHasChanged.emit(this.mFocus);
  }
  @Input('mFocused')
  public get mFocused() {
    return this.mFocus;
  }
  @Input() withDecimal = false;
  @Input() customMask = createNumberMask({
    allowDecimal: this.withDecimal,
    decimalSymbol: ',',
    thousandsSeparatorSymbol: '.'
  });

  @ViewChild('curInput') inputElement: ElementRef;

  propagateChange = (_: any) => { };

  constructor(
    readonly bdbMask: BdbMaskProvider,
    readonly renderer: Renderer2
  ) { }

  ngOnInit() { }

  public setFocus() {
    this.inputElement.nativeElement.focus();
    if (this.selectOnFocus) {
      this.inputElement.nativeElement.select();
    }
  }

  onBlur() {
    this.mFocused = false;
  }

  selectInput() {
    this.inputElement.nativeElement.select();
  }

  setDisabledState(isDisabled: boolean) {
    this.renderer.setProperty(this.inputElement.nativeElement, 'disabled', isDisabled);
    // disable other components here
  }

  onInputChange(event) {
    this.inputValue = event.target.value;
    this.propagateChange(this.bdbMask.unmaskToPlainNumber(this.inputValue));
  }

  writeValue(value: number) {
    if (value !== undefined && value !== null && value.toString() !== '') {
      this.inputValue = this.bdbMask.maskFormatFactory(
        value,
        this.withDecimal ? MaskType.CURRENCY : MaskType.CURRENCY_NOCENTS,
        this.locale
      );
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {

  }

  onKeyup() {
    this.onVerifyChange.emit();
  }
}

