export enum BetweenAccountPages {
  ACCOUNTS_LIST = 'ACCOUNTS-LIST',
  SCHEDULED_TRANSFERS = 'SCHEDULED-TRANSFERS',
  ENROLL_DESTINATION_ACCOUNT = 'ENROLL-DESTINATION-ACCOUNT',
  ENROLL_ACCOUNT_HOLDER = 'ENROLL-ACCOUNT-HOLDER',
  TRANSFER_TO_ACCOUNT_AMOUNT = 'TRANSFER-ACCOUNT-AMOUNT',
  TRANSFER_TO_ACCOUNT_SELECT_ACCOUNT = 'TRANSFER-ACCOUNT-SELECT-ACCOUNT',
  RESULT_OF_TRANSFER = 'RESULT_OF_TRANSFER'
}

export enum BetweenAccountPaths {
  ACCOUNTS_LIST = '',
  BASE_ROOT = '/entre-cuentas',
  ENROLL_ACCOUNT_HOLDER = '/inscribir-cuenta/titular',
  ENROLL_DESTINATION_ACCOUNT = '/inscribir-cuenta/cuenta-destino',
  SCHEDULED_TRANSFERS = '/programadas',
  TRANSFER_TO_ACCOUNT_AMOUNT = '/transferir/ingresar-monto',
  TRANSFER_TO_ACCOUNT_SELECT_ACCOUNT = '/transferir/seleccionar-cuenta',
  RESULT_OF_TRANSFER = '/transferir/resultado-transferencia'
}

export type BetweenAccountPage = `${BetweenAccountPages}`;

const navigationPaths = [
  {
    path: BetweenAccountPaths.SCHEDULED_TRANSFERS,
    page: BetweenAccountPages.SCHEDULED_TRANSFERS,
    addBaseRoot: false
  },
  {
    path: BetweenAccountPaths.ACCOUNTS_LIST,
    page: BetweenAccountPages.ACCOUNTS_LIST,
    addBaseRoot: true
  },
  {
    path: BetweenAccountPaths.ENROLL_DESTINATION_ACCOUNT,
    page: BetweenAccountPages.ENROLL_DESTINATION_ACCOUNT,
    addBaseRoot: true
  },
  {
    path: BetweenAccountPaths.ENROLL_ACCOUNT_HOLDER,
    page: BetweenAccountPages.ENROLL_ACCOUNT_HOLDER,
    addBaseRoot: true
  },
  {
    path: BetweenAccountPaths.TRANSFER_TO_ACCOUNT_AMOUNT,
    page: BetweenAccountPages.TRANSFER_TO_ACCOUNT_AMOUNT,
    addBaseRoot: true
  },
  {
    path: BetweenAccountPaths.TRANSFER_TO_ACCOUNT_SELECT_ACCOUNT,
    page: BetweenAccountPages.TRANSFER_TO_ACCOUNT_SELECT_ACCOUNT,
    addBaseRoot: true
  },
  {
    path: BetweenAccountPaths.RESULT_OF_TRANSFER,
    page: BetweenAccountPages.RESULT_OF_TRANSFER,
    addBaseRoot: true
  }
];

export const getNavigationPath = (page: BetweenAccountPage): string => {
  const getPathByPage = navigationPaths.find(pageItem => pageItem.page === page);
  const baseRoot: string = getPathByPage.addBaseRoot ? BetweenAccountPaths.BASE_ROOT : '';
  return baseRoot.concat(getPathByPage.path);
};
