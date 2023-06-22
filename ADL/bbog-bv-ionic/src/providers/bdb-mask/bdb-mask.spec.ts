
import { BdbMaskProvider } from './bdb-mask';
import { } from 'jasmine';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MaskType } from './bdb-mask-type.enum';
import { CustomCurrencyPipe } from '../../pipes/custom-currency';

let bdbMask: BdbMaskProvider = null;
const phoneMask: (string | RegExp)[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];


describe('BdbMask', () => {

  beforeEach(() => {
    const pipe = new DatePipe('en');
    const currency = new CurrencyPipe('en');
    const customCurrency = new CustomCurrencyPipe();
    bdbMask = new BdbMaskProvider(pipe, currency, customCurrency);
  });
/*
  it('should return a currency string', () => {
    expect(bdbMask.maskFormatFactory(124500, MaskType.CURRENCY)).toBe('124500');
  });

  it('should return a currency string', () => {
    expect(bdbMask.maskFormatFactory(124500, MaskType.CURRENCY)).toBe('$124,500');
  });

  it('should correctly unmask number', () => {
    const number = bdbMask.unmaskToPlainNumber('(320)310-5520');
    expect(number).toBe(3203105520);
  });

  it('should correctly unmask money', () => {
    const number = bdbMask.unmaskToPlainNumber('$320.000');
    expect(number).toBe(320000);
  });

  it('should return a phone mask RegExp', () => {
    const mMask: (string | RegExp)[] = bdbMask.maskToPhone();
    expect(mMask).toEqual(phoneMask);
  });
  */

});
