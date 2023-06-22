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
