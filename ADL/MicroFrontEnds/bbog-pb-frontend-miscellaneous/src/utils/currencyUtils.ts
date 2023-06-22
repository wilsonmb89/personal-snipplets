export const numberToCurrency = (value: string | number): string => {
  if (value) {
    const parsedValue = `${value}`;
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
