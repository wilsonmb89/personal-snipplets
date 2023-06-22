import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { RootState } from '..';

const initialState = { loading: false };

export const createLoaderState = createSlice({
  name: 'LoaderState',
  initialState,
  reducers: {
    enable(state) {
      return {
        ...state,
        loading: true
      };
    },
    disable(state) {
      return {
        ...state,
        loading: false
      };
    }
  }
});

export const loadingHandler = async (
  cb: (dispatch: Dispatch, getState?: () => RootState) => Promise<void>,
  dispatch: Dispatch,
  getState?: () => RootState
): Promise<void> => {
  try {
    dispatch(createLoaderState.actions.enable());
    await cb(dispatch, getState);
    dispatch(createLoaderState.actions.disable());
  } catch (error) {
    dispatch(createLoaderState.actions.disable());
    throw error;
  }
};

export const loadingActions = createLoaderState.actions;

export const isLoadingSelector = (state: RootState): boolean => state.loaderState.loading;
