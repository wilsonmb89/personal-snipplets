import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './account-add.entity';

export const createNewAccountState = createSlice({
  name: 'NewAccountState',
  initialState,
  reducers: {
    addNewAccountSuccess(state) {
      return {
        ...state,
        addNewAccountSuccess: true,
        addNewAccountError: ''
      };
    },
    addNewAccountfailed(state, { payload }: PayloadAction<string>) {
      return {
        ...state,
        addNewAccountSuccess: false,
        addNewAccountError: payload
      };
    }
  }
});

export const newAccountActions = createNewAccountState.actions;

export default createNewAccountState.reducer;
