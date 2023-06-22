import { ActionReducer, Action } from '@ngrx/store';
import { merge, pick } from 'lodash-es';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';

export function storageMetaReducer<S, A extends Action = Action>(saveKeys: string[],
  localStorageKey: string,
  storageService: BdbStorageService
) {
  let onInit = true;
  return function (reducer: ActionReducer<S, A>) {
    return function (state: S, action: A): S {

      const nextState = reducer(state, action);

      if (onInit) {
        onInit = false;
        const savedState = storageService.getSavedState(localStorageKey);
        return merge(nextState, savedState);
      }

      const stateToSave = pick(nextState, saveKeys);
      storageService.setSavedState(stateToSave, localStorageKey);

      return nextState;
    };
  };
}
