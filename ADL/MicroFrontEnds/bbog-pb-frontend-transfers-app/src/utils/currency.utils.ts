export const numberToCurrency = (value: string | number): string => {
  if (value) {
    const parsedValue = `${value}`;
    const trasformedData = `$${parsedValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return trasformedData === '$' ? '' : trasformedData;
  }
  return '';
};

export const numberWithDecimalToCurrency = (value: string | number): string => {
  if (value) {
    const parsedValue = `${value}`;
    if (parsedValue.indexOf('.') !== -1) {
      const [integerValue, decimalValue] = parsedValue.split('.');
      const trasformedData = `$${integerValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      return trasformedData === '$' ? '' : `${trasformedData}.${decimalValue}`;
    }
    const trasformedData = `$${parsedValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return trasformedData === '$' ? '' : trasformedData;
  }
  return '';
};

export const currencyToNumber = (amount: number | string): number => {
  try {
    return amount ? +`${amount}`.match(/\d+/g).join('') : null;
  } catch (error) {
    return null;
  }
};

export const currencyToNumberSherpa = (value: number | string): number => {
  try {
    const parsedValue = `${value}`;
    if (parsedValue.indexOf(',') !== -1) {
      let [integerValue, decimalValue] = parsedValue.split(',');
      integerValue = integerValue.replace(/\D/g, '');
      decimalValue = decimalValue.replace(/\D/g, '');
      return +`${integerValue || '0'}.${decimalValue || '0'}`;
    }
    return +parsedValue.replace(/\D/g, '');
  } catch (error) {
    return null;
  }
};
