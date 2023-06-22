export enum ScheduledTranfersPages {
  SCHEDULED_LIST = 'SCHEDULED_LIST',
  SCHEDULED_CREATE = 'SCHEDULED_CREATE',
  SCHEDULED_UPDATE = 'SCHEDULED_UPDATE',
  SCHEDULED_ACCT_CHECK = 'SCHEDULED_ACCT_CHECK'
}

export enum ScheduledTranfersPaths {
  SCHEDULED_LIST = '',
  BASE_ROOT = '/programadas',
  SCHEDULED_CREATE = '/crear',
  SCHEDULED_UPDATE = '/editar',
  SCHEDULED_ACCT_CHECK = '/seleccionar-cuenta',
  IS_INTERNAL = '?internal=true'
}

export type ScheduledTranfersPage = `${ScheduledTranfersPages}`;

export const NAVIGATION_PATHS = {
  ROOT: ScheduledTranfersPaths.BASE_ROOT,
  CREATE: `${ScheduledTranfersPaths.BASE_ROOT}${ScheduledTranfersPaths.SCHEDULED_CREATE}`,
  UPDATE: `${ScheduledTranfersPaths.BASE_ROOT}${ScheduledTranfersPaths.SCHEDULED_UPDATE}`,
  ACCT_CHECK: `${ScheduledTranfersPaths.BASE_ROOT}${ScheduledTranfersPaths.SCHEDULED_ACCT_CHECK}`
};

export const getNavigationPath = (page: ScheduledTranfersPage, isInternal = true): string => {
  let path = '';
  switch (page) {
    case ScheduledTranfersPages.SCHEDULED_ACCT_CHECK:
      path = NAVIGATION_PATHS.ACCT_CHECK;
      break;
    case ScheduledTranfersPages.SCHEDULED_CREATE:
      path = NAVIGATION_PATHS.CREATE;
      break;
    case ScheduledTranfersPages.SCHEDULED_UPDATE:
      path = NAVIGATION_PATHS.UPDATE;
      break;
    default:
      path = NAVIGATION_PATHS.ROOT;
      break;
  }
  if (isInternal) {
    path = path.concat(ScheduledTranfersPaths.IS_INTERNAL);
  }
  return path;
};
