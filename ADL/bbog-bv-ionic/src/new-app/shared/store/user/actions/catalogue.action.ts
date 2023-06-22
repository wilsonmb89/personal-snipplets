import { CatalogsEnum } from '../../../../core/services-delegate/list-parameters/enums/catalogs-enum';
import { Action } from '@ngrx/store';

export const GET_CATALOGUE = '[User/API] Get catalogue';
export const GET_CATALOGUE_SUCCESS = '[User/API] Get catalogue success';
export const GET_CATALOGUE_SKIPED = '[User/API] Get catalogue skiped';
export const GET_CATALOGUE_ERROR = '[User/API] Get catalogue error';

export class GetCatalogueAction implements Action {
  readonly type = GET_CATALOGUE;

  constructor(public catalogueType: CatalogsEnum) {}
}

export class GetCatalogueSuccessAction implements Action {
  readonly type = GET_CATALOGUE_SUCCESS;

  constructor(public catalogue?: any) {}
}

export class GetCatalogueSkipedAction implements Action {
  readonly type = GET_CATALOGUE_SKIPED;
}

export class GetCatalogueErrorAction implements Action {
  readonly type = GET_CATALOGUE_ERROR;

  constructor(public error: any) {}
}

export type CatalogueActions =
  GetCatalogueAction |
  GetCatalogueSuccessAction |
  GetCatalogueSkipedAction |
  GetCatalogueErrorAction;
