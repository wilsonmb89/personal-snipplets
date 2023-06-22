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
Object.defineProperty(process.env, 'API_URL', { value: '/api-gateway' });

// eslint-disable-next-line no-undef
HTMLCanvasElement.prototype.getContext = () => {
  // return whatever getContext has to return
};

jest.mock('@avaldigitallabs/bbog-pb-lib-frontend-commons', () => ({
  decrypt: jest.fn().mockImplementation(value => (value ? JSON.parse(value) : value)),
  encrypt: jest.fn().mockImplementation(value => (value ? JSON.stringify(value) : value)),
  BusinessErrorCodes: { Challenge: 'CHALLENGE' },
  BusinessErrorMessages: { InvalidToken: 'Validacion de Token No Exitosa' },
  getFPData: () => ({ Identifiers: { unanimity1: '078894e388a64ea9e19a4aa526558c296af054f711b374cd60101e9ceca6a307' } })
}));
