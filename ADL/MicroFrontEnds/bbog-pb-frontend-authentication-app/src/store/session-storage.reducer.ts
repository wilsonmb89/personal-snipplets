import { ActionReducerMapBuilder, AnyAction, EntityAdapter, EntityState } from '@reduxjs/toolkit';
import { encrypt, decrypt } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';

const isActionAllowedToSave = (key: string, allowedToSaveActions: string[], action: AnyAction): boolean => {
  return allowedToSaveActions?.map(saveAction => `${key}/${saveAction}`).includes(action.type);
};
const isActionInit = (action: AnyAction): boolean => action.type.includes('MOUNT');
const LOCAL = 'LOCAL';

export const sessionStorageReducer = <T, U>(
  builder: ActionReducerMapBuilder<T>,
  key: string,
  allowedToSaveActions: string[],
  adapter?: { entityAdapter: EntityAdapter<U>; stateAdapterAttribute?: string }
): void => {
  builder
    // Save the state on the session storage
    .addMatcher(isActionAllowedToSave.bind(null, key, allowedToSaveActions), state => {
      const sessionKey = process.env.TAG === LOCAL ? key : btoa(key);
      const selectors = adapter?.entityAdapter?.getSelectors();
      const value = selectors
        ? selectors.selectAll((state[adapter?.stateAdapterAttribute] || (state as unknown)) as EntityState<U>)
        : state;

      sessionStorage.setItem(sessionKey, process.env.TAG === LOCAL ? JSON.stringify(value) : encrypt(value));
    })
    // Retrieve state from the session storage
    .addMatcher(isActionInit, state => {
      const sessionKey = process.env.TAG === LOCAL ? key : btoa(key);
      const savedSessionData = sessionStorage.getItem(sessionKey);
      const parsedSavedSessionData = () => (savedSessionData ? JSON.parse(savedSessionData) : null);
      const savedState = process.env.TAG === LOCAL ? parsedSavedSessionData() : decrypt(savedSessionData);
      if (savedState) {
        if (adapter?.entityAdapter) {
          adapter.entityAdapter.setAll(state[adapter?.stateAdapterAttribute], savedState);
          return state;
        }
        return { ...state, ...savedState };
      }
    });
};
