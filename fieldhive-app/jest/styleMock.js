// Mock style imports for Jest
module.exports = {
  // Return an empty object for CSS Module imports
  __esModule: true,
  default: new Proxy(
    {},
    {
      get: function getter(target, key) {
        // Return the key as the class name
        if (key === '__esModule') return false;
        return key;
      },
    }
  ),
};
