/* eslint-disable no-undef */
const sessionStorageMock = (function () {
  var store = {};
  return {
    getItem: function (key) {
      return store[key];
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

HTMLCanvasElement.prototype.getContext = () => {
  // return whatever getContext has to return
};

Object.defineProperty(process.env, 'API_URL', { value: '/api-gateway' });

jest.mock('@avaldigitallabs/bbog-pb-lib-frontend-commons', () => ({
  decrypt: jest.fn().mockImplementation(value => (value ? JSON.parse(value) : value)),
  encrypt: jest.fn().mockImplementation(value => (value ? JSON.stringify(value) : value))
}));
