import { } from 'jasmine';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BdbPhoneInputComponent } from './bdb-phone-input';
import { BdbMaskProvider } from '../../../providers/bdb-mask/bdb-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { CustomCurrencyPipe } from 'pipes/custom-currency';


describe('bdb phone input test suite', () => {
    let component: BdbPhoneInputComponent;
    let fixture: ComponentFixture<BdbPhoneInputComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbPhoneInputComponent
            ],
            providers: [
                BdbMaskProvider,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe
            ],
            imports: [
                TextMaskModule
            ]
        });

        fixture = TestBed.createComponent(BdbPhoneInputComponent);
        // get test component from the fixture
        component = fixture.componentInstance;
        inputEl = fixture.debugElement.query(By.css('.input-item'));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be created', () => {
        expect(inputEl).toBeDefined();
    });

    it('shouldn\'t apply mask if value is undefined null or empty', () => {
        component.writeValue(undefined);
        fixture.detectChanges();
        expect(inputEl.nativeElement.value).toBe('');
        component.writeValue(null);
        fixture.detectChanges();
        expect(inputEl.nativeElement.value).toBe('');
    });

    it('should apply mask', () => {
        component.writeValue(3104423044);
        fixture.detectChanges();
        expect(inputEl.nativeElement.value).toBe('3104423044');
    });

    it('should set disable state', () => {
        component.setDisabledState(true);
        fixture.detectChanges();
        expect(inputEl.nativeElement.disabled).toBeTruthy();
    });


    it('should update value and propagate the change', () => {
        const event = {
            target: {
                value: '5000'
            }
        };
        spyOn(component, 'propagateChange');
        component.onInputChange(event);
        fixture.detectChanges();
        expect(inputEl.nativeElement.value).toBe('5000');
        expect(component.propagateChange).toHaveBeenCalled();
    });

    it('should register on change', () => {
        component.registerOnChange(null);
        fixture.detectChanges();
        expect(component.propagateChange).toBeNull();
    });
});
