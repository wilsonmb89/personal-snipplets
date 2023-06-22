import { initialState } from './account-add.entity';
import reducer, { newAccountActions } from './account-add.reducer';

test('should turn true addNweAccountSuccess', () => {
  expect(reducer(initialState, newAccountActions.addNewAccountSuccess())).toEqual({
    addNewAccountSuccess: true,
    addNewAccountError: ''
  });
});

test('should turn false addNweAccountSuccess', () => {
  expect(reducer(initialState, newAccountActions.addNewAccountfailed('error'))).toEqual({
    addNewAccountSuccess: false,
    addNewAccountError: 'error'
  });
});
