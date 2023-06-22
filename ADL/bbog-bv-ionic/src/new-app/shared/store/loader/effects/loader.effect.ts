import * as loaderActions from '../actions/loader.action';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { ProductsService } from '../../../../core/services-apis/products/products/products.service';
import { LoadingController } from 'ionic-angular';
import { BdbLoaderService } from '../../../../shared/utils/bdb-loader-service/loader.service';



@Injectable()
export class LoaderEffects {

    @Effect({ dispatch: false })
    enableLodingEffect$: Observable<Action> = this.actions$
        .ofType(loaderActions.ENABLE_LOADING_ACTION)
        .pipe(
            tap((_) => {
                this.loadingService.show();
            }),
        );

    @Effect({ dispatch: false })
    disableLodingEffect$: Observable<Action> = this.actions$
        .ofType(loaderActions.DISABLE_LOADING_ACTION)
        .pipe(
            tap((_) => {
                this.loadingService.hide();
            }),
        );

    @Effect()
    enableLodingObserverEffect$: Observable<Action> = this.actions$
        .ofType(...loaderActions.EnableLoadingObserverActionsTypes)
        .pipe(
            map(() => new loaderActions.EnableLoadingAction()),
        );

    @Effect()
    disableLodingObserverEffect$: Observable<Action> = this.actions$
        .ofType(...loaderActions.DisableLoadingObserverActionsTypes)
        .pipe(
            map(() => new loaderActions.DisableLoadingAction())
        );

    constructor(private actions$: Actions, private loadingService: BdbLoaderService) {}

}
