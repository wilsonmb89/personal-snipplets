export enum CashAdvancePages {
  CASH_ADVANCE_LIST = 'CASH-ADVANCE-LIST',
  CASH_ADVANCE_AMOUNT = 'CASH-ADVANCE-AMOUNT',
  CASH_ADVANCE_DESTINATION = 'CASH-ADVANCE-DESTINATION',
  CASH_ADVANCE_CONFIRM = 'CASH-ADVANCE-CONFIRM',
  CASH_ADVANCE_RESULT = 'CASH-ADVANCE-RESULT'
}

export enum CashAdvancePaths {
  CASH_ADVANCE_LIST = '',
  CASH_ADVANCE_AMOUNT = '/monto-avance',
  CASH_ADVANCE_DESTINATION = '/cuenta-destino',
  CASH_ADVANCE_CONFIRM = '/resumen',
  CASH_ADVANCE_RESULT = '/resultado-avance',
  BASE_ROOT = '/avances'
}

export type CashAdvancePage = `${CashAdvancePages}`;

const navigationPaths = [
  {
    path: CashAdvancePaths.CASH_ADVANCE_LIST,
    page: CashAdvancePages.CASH_ADVANCE_LIST,
    addBaseRoot: true
  },
  {
    path: CashAdvancePaths.CASH_ADVANCE_AMOUNT,
    page: CashAdvancePages.CASH_ADVANCE_AMOUNT,
    addBaseRoot: true
  },
  {
    path: CashAdvancePaths.CASH_ADVANCE_DESTINATION,
    page: CashAdvancePages.CASH_ADVANCE_DESTINATION,
    addBaseRoot: true
  },
  {
    path: CashAdvancePaths.CASH_ADVANCE_CONFIRM,
    page: CashAdvancePages.CASH_ADVANCE_CONFIRM,
    addBaseRoot: true
  },
  {
    path: CashAdvancePaths.CASH_ADVANCE_RESULT,
    page: CashAdvancePages.CASH_ADVANCE_RESULT,
    addBaseRoot: true
  }
];

export const getNavigationPath = (page: CashAdvancePage): string => {
  const getPathByPage = navigationPaths.find(pageItem => pageItem.page === page);
  const baseRoot: string = getPathByPage.addBaseRoot ? CashAdvancePaths.BASE_ROOT : '';
  return baseRoot.concat(getPathByPage.path);
};
