import {
  Component,
  Prop,
  Event,
  EventEmitter,
  Element,
  h,
  Watch,
  State,
  Host
} from '@stencil/core';
import { Color, ColorVariant, StateInput, TextAlign, TextFieldTypes } from '../../../interface';
@Component({
  tag: 'pulse-input',
  styleUrl: 'pulse-input.scss',
  scoped: true
})
export class PulseInput {

  private inputId = `pulse-input-${inputIds++}`;
  private isCurrency: boolean;

  @Element() el!: HTMLElement;
  @State() hasFocus = false;
  @Prop() label: string;
  @Prop() labelerror: string = '';
  @Prop() name: string = this.inputId;
  @Prop() pattern: string;
  @Prop() min: string;
  @Prop() max: string;
  @Prop() inputmode: string;
  @Prop() minlength: number;
  @Prop() maxlength: number;
  @Prop() disabled: boolean = false;
  @Prop() placeholder: string;
  @Prop() type: TextFieldTypes = 'text';
  @Prop() hasdecimals: boolean = false;
  @Prop() autofocus: boolean = false;
  @Prop() autocomplete: 'on' | 'off' = 'off';
  @Prop() readonly: boolean = false;
  @Prop() step: string;
  @Prop() spellcheck: boolean = false;
  @Prop() required: boolean = false;
  @Prop({ reflectToAttr: true }) state: StateInput = 'basic';
  @Prop({ mutable: true }) value: string | null = '';
  @Prop() blocked: boolean = false;
  @Prop() optional: boolean = false;
  @Prop() inputtextalign: TextAlign = 'left';
  @Prop() icon: string;
  @Prop() iconcolor: Color = 'carbon';
  @Prop() iconcolorvariant: ColorVariant = '400';
  @Prop() actionableicon: boolean = false;
  @Prop() lefticon: boolean = false;
  @Event() keyBoardInput: EventEmitter<KeyboardEvent>;
  @Event() valueEmmitInput: EventEmitter<string>;
  @Event() inputFocus: EventEmitter;
  @Event() pulseInputDidLoad!: EventEmitter<void>;
  @Event() ionInputDidUnload!: EventEmitter<void>;
  @Event() inputBlur!: EventEmitter<void>;
  @Event() inputKeyDown!: EventEmitter;
  @Event() inputKeyUp!: EventEmitter;
  @Event() inputClick!: EventEmitter;
  @Event() iconClick: EventEmitter;

  constructor() { }

  componentWillLoad(): void {
    if (this.type === 'currency') {
      this.isCurrency = true;
      this.type = 'text';
      if (!!this.value) {
        this.value = this.formatCurrency(this.value);
      }
    }
  }

  componentDidLoad() {
    this.pulseInputDidLoad.emit();
  }

  componentDidUnload() {
    this.ionInputDidUnload.emit();
  }

  private onBlur = () => {
    this.iconcolorvariant ='400';
    this.hasFocus = false;
    if (this.isCurrency) {
      this.value = this.formatCurrency(this.value, true);
      const input = this.el.querySelector('input');
      if (input.value !== this.value) {
        input.value = this.value;
      }
    }
    this.inputBlur.emit();
  };

  private onFocus = (ev: MouseEvent) => {
    this.iconcolorvariant ='700';
    this.hasFocus = true;
    this.inputFocus.emit(ev);
  };

  @Watch('value')
  protected valueChanged() {
    if (this.isCurrency) {
      this.value = this.formatCurrency(this.value);
    }
    const input = this.el.querySelector('input');
    if (!!input && input.value !== this.value) {
      input.value = this.value;
    }
    this.valueEmmitInput.emit(this.value);
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!!input) {
      this.value = input.value
    }
    this.keyBoardInput.emit(event as KeyboardEvent);
  }

  private formatCurrency(currentValue: string, isBlur: boolean = false): string {
    if (!!currentValue) {
      currentValue = currentValue.replace('$', '');
      if (!(this.hasdecimals && (currentValue === '0' || currentValue === '.'))) {
        currentValue = currentValue.replace(/^0+/, '');
      }
      const decimalPos = currentValue.indexOf('.');
      if (decimalPos >= 0) {
        let leftSide = currentValue.substring(0, decimalPos);
        let rightSide = currentValue.substring(decimalPos);
        leftSide = this.formatNumber(leftSide);

        leftSide = leftSide.length === 0 ? '0' : leftSide;

        rightSide = this.formatNumber(rightSide);
        if (isBlur) {
          rightSide += '00';
        }
        rightSide = rightSide.substring(0, 2);
        currentValue = this.hasdecimals ? `$${leftSide}.${rightSide}` : `$${leftSide}`;
      } else {
        currentValue = `$${this.formatNumber(currentValue)}`;
        if (isBlur && this.hasdecimals) {
          currentValue += '.00';
        }
      }
    }
    return currentValue !== '$' ?  currentValue : '';
  }

  private formatNumber(value: string): string {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleKeyDown(ev: KeyboardEvent) {
    this.inputKeyDown.emit(ev);
  }

  handleKeyUp(ev: KeyboardEvent) {
    this.inputKeyUp.emit(ev);
  }

  handleClick(ev: MouseEvent) {
    this.inputClick.emit(ev);
  }

  handleClickIcon(ev: MouseEvent) {
    this.iconClick.emit(ev);
  }

  render() {
    return (
      <Host class="pulse-input">
        <div class={{
            ['pulse-input__container']: true,
            [`input-${this.state}`]: !(this.disabled || this.blocked),
            ['input-optional']: this.state === 'basic' && !(this.disabled || this.blocked) && this.optional
          }}
        >
          {!!this.label && (
            <div class="pulse-input__container__info-label">
              <label class='pulse-tp-bo4-comp-m'>{this.label}</label>
            </div>
          )}
          <div class={{
            ['pulse-input__container__input']: true,
            ['left-icon']: !!this.icon && this.lefticon
          }}>
            <input
              class={{
                ['pulse-input__container__input--input-native']: true,
                ['pulse-input__container__input--input-native--with-icon']: !!this.icon,
                [`align-${this.inputtextalign}`]: true
              }}
              type={this.type}
              placeholder={this.blocked ? '-' : this.placeholder}
              value={this.value}
              disabled={this.disabled || this.blocked}
              min={this.min}
              max={this.max}
              inputmode={this.inputmode}
              minlength={this.minlength}
              maxlength={this.maxlength}
              autoFocus={this.autofocus}
              autoComplete={this.autocomplete}
              readOnly={this.readonly}
              step={this.step}
              spellCheck={this.spellcheck}
              pattern={this.pattern}
              required={this.required}
              name={this.name}
              onKeyDown={ev => this.handleKeyDown(ev)}
              onKeyUp={ev => this.handleKeyUp(ev)}
              onInput={ev => this.handleInput(ev)}
              onClick={ev => this.handleClick(ev)}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
            />
            {!!this.icon && (
              <div onClick={ev => this.handleClickIcon(ev)}
                class={{
                  ['pulse-input__container__input--icon']: true,
                  ['actionable-icon']: this.actionableicon && !(this.disabled || this.blocked)
                }}>
                <pulse-icon icon={this.icon} color={this.iconcolor} colorvariant={this.iconcolorvariant}></pulse-icon>
              </div>
            )}
          </div>
          {!!this.labelerror && !(this.disabled || this.blocked) && (
            <div class="pulse-input__container__helper-label">
              <label class={{
                ['helperLabel pulse-tp-bo4-comp-r']: true,
                [`helperLabel--${this.state}`]: true
              }}>{this.labelerror}</label>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
let inputIds = 0;
