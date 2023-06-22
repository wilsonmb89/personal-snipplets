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
// eslint-disable-next-line no-undef
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// eslint-disable-next-line no-undef
HTMLCanvasElement.prototype.getContext = () => {
  // return whatever getContext has to return
};

const gRecaptchaMock = (function () {
  return {
    ready: cb => {
      cb();
    },
    execute: () => {
      return 'dummy_token';
    }
  };
})();

Object.defineProperty(window, 'grecaptcha', { value: gRecaptchaMock });
Object.defineProperty(process.env, 'API_URL', { value: '/api-gateway' });
Object.defineProperty(process.env, 'LOGIN_URL', { value: '/login' });
Object.defineProperty(process.env, 'STANDALONE', { value: 'true' });

jest.mock('@avaldigitallabs/bbog-pb-lib-frontend-commons', () => ({
  decrypt: jest.fn().mockImplementation(value => (value ? JSON.parse(value) : value)),
  encrypt: jest.fn().mockImplementation(value => (value ? JSON.stringify(value) : value)),
  promptLogin: jest.fn().mockImplementation(() => Promise.resolve()),
  createInterceptors: jest.fn().mockImplementation(() => Promise.resolve({ destroy: jest.fn() }))
}));
