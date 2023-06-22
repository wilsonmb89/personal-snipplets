import { } from 'jasmine';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BdbCurrencyInputComponent } from './bdb-currency-input';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TextMaskModule } from 'angular2-text-mask';
import { BdbMaskProvider } from '../../../providers/bdb-mask/bdb-mask';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { BdbFormInputDirective } from '../../../directives/bdb-form-input/bdb-form-input';
import { DirectivesModule } from '../../../directives/directives.module';
import { CustomCurrencyPipe } from 'pipes/custom-currency';

describe('component: BdbCurrencyInput', () => {
  let bdbCurrency: BdbCurrencyInputComponent;
  let fixture: ComponentFixture<BdbCurrencyInputComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BdbCurrencyInputComponent
      ],
      providers: [
        BdbMaskProvider,
        DatePipe,
        CurrencyPipe,
        CustomCurrencyPipe
      ],
      imports: [
        TextMaskModule,
        DirectivesModule
      ]
    });
    // create component and test fixture
    fixture = TestBed.createComponent(BdbCurrencyInputComponent);

    // get test component from the fixture
    bdbCurrency = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.directive(BdbFormInputDirective));
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should be created', () => {
    expect(inputEl).toBeDefined();
  });

  it('should apply mask to number', () => {
    bdbCurrency.writeValue(5000);
    fixture.detectChanges();
    console.log(inputEl.nativeElement.value);
    expect(inputEl.nativeElement.value).toContain('$');
  });

  it('shouldn\'t apply mask if value is undefined null or empty', () => {
    bdbCurrency.writeValue(undefined);
    fixture.detectChanges();
    expect(inputEl.nativeElement.value).toBe('');
    bdbCurrency.writeValue(null);
    fixture.detectChanges();
    expect(inputEl.nativeElement.value).toBe('');
  });

  it('should select input', () => {
    spyOn(inputEl.nativeElement, 'select');
    bdbCurrency.selectInput();
    fixture.detectChanges();
    expect(inputEl.nativeElement.select).toHaveBeenCalled();
  });

  it('should emit onVerifyChange', () => {
    spyOn(bdbCurrency.onVerifyChange, 'emit');
    bdbCurrency.onKeyup();
    expect(bdbCurrency.onVerifyChange.emit).toHaveBeenCalled();
  });

  it('should set disable state', () => {
    bdbCurrency.setDisabledState(true);
    expect(inputEl.nativeElement.disabled).toBeTruthy();
  });

  it('should set focus', () => {
    spyOn(inputEl.nativeElement, 'focus');
    spyOn(inputEl.nativeElement, 'select');
    bdbCurrency.selectOnFocus = true;
    bdbCurrency.setFocus();
    fixture.detectChanges();
    expect(inputEl.nativeElement.focus).toHaveBeenCalled();
    expect(inputEl.nativeElement.select).toHaveBeenCalled();

  });

  it('should not select when select on focus is false', () => {
    spyOn(inputEl.nativeElement, 'select');
    bdbCurrency.selectOnFocus = false;
    bdbCurrency.setFocus();
    fixture.detectChanges();
    expect(inputEl.nativeElement.select).not.toHaveBeenCalled();
  });

  it('should unfocus', () => {
    bdbCurrency.onBlur();
    expect(bdbCurrency.mFocused).toBeFalsy();
  });

  it('should return focus state', () => {
    bdbCurrency.mFocused = true;
    expect(bdbCurrency.mFocused).toBeTruthy();
  });

  it('should update value and propagate the change', () => {
    const event = {
      target: {
        value: '$5,000'
      }
    };
    spyOn(bdbCurrency, 'propagateChange');
    bdbCurrency.onInputChange(event);
    fixture.detectChanges();
    expect(inputEl.nativeElement.value).toBe('$5,000');
    expect(bdbCurrency.propagateChange).toHaveBeenCalled();
  });

  it('should register on change', () => {
    bdbCurrency.registerOnChange(null);
    fixture.detectChanges();
    expect(bdbCurrency.propagateChange).toBeNull();
  });
});
