// ToDo: explore and use some module of https://date-fns.org/ to improve this

export const validateFormatDate = (dateString: string): boolean | string => {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) {
    return 'Ingrese un valor válido.';
  }
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) {
    return 'Ingrese un valor válido.';
  }
  return d.toISOString().slice(0, 10) === dateString;
};

export const fromStringToDate = (dateString: string): string => {
  const date = new Date(dateString.substring(0, dateString.length - 1)); // todo: revisar quitar la Z al final para que tome zona horaria local
  return `${date.getDate()} ${fromDateToSpanishMonth(date)} ${date.getFullYear()}`;
};

const fromDateToSpanishMonth = (date: Date): string => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months[date.getMonth()];
};
