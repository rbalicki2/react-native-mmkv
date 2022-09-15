"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMMKV = void 0;

var _window$document;

/* global localStorage */
const canUseDOM = typeof window !== 'undefined' && ((_window$document = window.document) === null || _window$document === void 0 ? void 0 : _window$document.createElement) != null;

const createMMKV = config => {
  if (config.id !== 'mmkv.default') {
    throw new Error("MMKV: 'id' is not supported on Web!");
  }

  if (config.encryptionKey != null) {
    throw new Error("MMKV: 'encryptionKey' is not supported on Web!");
  }

  if (config.path != null) {
    throw new Error("MMKV: 'path' is not supported on Web!");
  }

  const storage = () => {
    var _ref, _global$localStorage, _global, _window;

    if (!canUseDOM) {
      throw new Error('Tried to access storage on the server. Did you forget to call this in useEffect?');
    }

    const domStorage = (_ref = (_global$localStorage = (_global = global) === null || _global === void 0 ? void 0 : _global.localStorage) !== null && _global$localStorage !== void 0 ? _global$localStorage : (_window = window) === null || _window === void 0 ? void 0 : _window.localStorage) !== null && _ref !== void 0 ? _ref : localStorage;

    if (domStorage == null) {
      throw new Error(`Could not find 'localStorage' instance!`);
    }

    return domStorage;
  };

  return {
    clearAll: () => storage().clear(),
    delete: key => storage().removeItem(key),
    set: (key, value) => storage().setItem(key, value.toString()),
    getString: key => {
      var _storage$getItem;

      return (_storage$getItem = storage().getItem(key)) !== null && _storage$getItem !== void 0 ? _storage$getItem : undefined;
    },
    getNumber: key => {
      const value = storage().getItem(key);
      if (value == null) return undefined;
      return Number(value);
    },
    getBoolean: key => {
      const value = storage().getItem(key);
      if (value == null) return undefined;
      return value === 'true';
    },
    getAllKeys: () => Object.keys(storage()),
    contains: key => storage().getItem(key) != null,
    recrypt: () => {
      throw new Error('`recrypt(..)` is not supported on Web!');
    }
  };
};

exports.createMMKV = createMMKV;
//# sourceMappingURL=createMMKV.web.js.map