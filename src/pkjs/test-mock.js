

const localStorageMock = (function () {
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

module.exports = {
  setup: function() {
    Object.defineProperty(global, 'localStorage', {value: localStorageMock});
    Object.defineProperty(global, 'Pebble', {value: {}});
    Object.defineProperty(global, 'XMLHttpRequest', {value: require("xmlhttprequest").XMLHttpRequest});
  }
};

