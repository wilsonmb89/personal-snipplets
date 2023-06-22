// ToDo: explore and use some module of https://date-fns.org/ to improve this

export const fromStringToDate = (dateString: string): string => {
  const date = new Date(dateString.substring(0, dateString.length - 1)); // todo: revisar quitar la Z al final para que tome zona horaria local
  return `${date.getDate()} ${fromDateToSpanishMonth(date)} ${date.getFullYear()}`;
};

export const fromISOStringToDate = (dateISO: string): Date => {
  if (dateISO) {
    const splitDate = dateISO.split('-').map(value => parseInt(value));
    return new Date(splitDate[0], splitDate[1] - 1, splitDate[2]);
  }
};

const fromDateToSpanishMonth = (date: Date): string => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months[date.getMonth()];
};
