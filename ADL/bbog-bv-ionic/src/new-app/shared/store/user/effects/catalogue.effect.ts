import * as catalogueActions from '../actions/catalogue.action';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { UserState } from '../states/user.state';
import { catalogueByTypeSelector } from '../selectors/catalogue.selector';
import { UserFeaturesService } from '@app/apis/user-features/user-features.service';

@Injectable()
export class CatalogueEffects {
  @Effect()
  getCatalogueEffect$: Observable<Action> = this.actions$
    .ofType(catalogueActions.GET_CATALOGUE)
    .pipe(
      concatMap((action: any) =>
        of(action).pipe(
          withLatestFrom(this.store.select(catalogueByTypeSelector(action.catalogueType)))
        )
      ),
      switchMap(([action, catalogue]) => {
        if (!catalogue) {
          return this.userFeaturesApiService.getCatalogues({
            catalogName: action.catalogueType,
            parentId: null,
          }).pipe(
            map((newCatalogue) => ({
              type: catalogueActions.GET_CATALOGUE_SUCCESS,
              catalogue: {[action.catalogueType]: newCatalogue.catalogItems},
            })),
            catchError(error => of({type: catalogueActions.GET_CATALOGUE_ERROR, error}))
          );
        }
        return of({ type: catalogueActions.GET_CATALOGUE_SKIPED });
      })
    );

  constructor(
    private userFeaturesApiService: UserFeaturesService,
    private store: Store<UserState>,
    private actions$: Actions
  ) {}
}
