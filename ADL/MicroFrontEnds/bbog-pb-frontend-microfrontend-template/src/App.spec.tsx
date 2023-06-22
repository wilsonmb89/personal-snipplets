import React from 'react';
import App from './App';
import { render } from './test-utils/provider-mock';

describe('App unit tests', () => {
  const navigate = jest.fn();
  test('should start the application succesfully', () => {
    const app = render(<App navigate={navigate} />);
    expect(app).toBeTruthy();
  });
});
