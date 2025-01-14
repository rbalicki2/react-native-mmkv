"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMMKV = useMMKV;
exports.useMMKVBoolean = void 0;
exports.useMMKVListener = useMMKVListener;
exports.useMMKVNumber = void 0;
exports.useMMKVObject = useMMKVObject;
exports.useMMKVString = void 0;

var _react = require("react");

var _MMKV = require("./MMKV");

function isConfigurationEqual(left, right) {
  if (left == null || right == null) return left == null && right == null;
  return left.encryptionKey === right.encryptionKey && left.id === right.id && left.path === right.path;
}

let defaultInstance = null;

function getDefaultInstance() {
  if (defaultInstance == null) {
    defaultInstance = new _MMKV.MMKV();
  }

  return defaultInstance;
}
/**
 * Use the default, shared MMKV instance.
 */


function useMMKV(configuration) {
  const instance = (0, _react.useRef)();
  const lastConfiguration = (0, _react.useRef)();
  if (configuration == null) return getDefaultInstance();

  if (instance.current == null || !isConfigurationEqual(lastConfiguration.current, configuration)) {
    lastConfiguration.current = configuration;
    instance.current = new _MMKV.MMKV(configuration);
  }

  return instance.current;
}

function createMMKVHook(getter) {
  return (key, instance) => {
    const mmkv = instance !== null && instance !== void 0 ? instance : getDefaultInstance();
    const [value, setValue] = (0, _react.useState)(() => getter(mmkv, key));
    const valueRef = (0, _react.useRef)(value);
    valueRef.current = value; // update value by user set

    const set = (0, _react.useCallback)(v => {
      const newValue = typeof v === 'function' ? v(valueRef.current) : v;

      switch (typeof newValue) {
        case 'number':
        case 'string':
        case 'boolean':
          mmkv.set(key, newValue);
          break;

        case 'undefined':
          mmkv.delete(key);
          break;

        default:
          throw new Error(`MMKV: Type ${typeof newValue} is not supported!`);
      }
    }, [key, mmkv]); // update value if key or instance changes

    (0, _react.useEffect)(() => {
      setValue(getter(mmkv, key));
    }, [key, mmkv]); // update value if it changes somewhere else (second hook, same key)

    (0, _react.useEffect)(() => {
      const listener = mmkv.addOnValueChangedListener(changedKey => {
        if (changedKey === key) {
          setValue(getter(mmkv, key));
        }
      });
      return () => listener.remove();
    }, [key, mmkv]);
    return [value, set];
  };
}
/**
 * Use the string value of the given `key` from the given MMKV storage instance.
 *
 * If no instance is provided, a shared default instance will be used.
 *
 * @example
 * ```ts
 * const [username, setUsername] = useMMKVString("user.name")
 * ```
 */


const useMMKVString = createMMKVHook((instance, key) => instance.getString(key));
/**
 * Use the number value of the given `key` from the given MMKV storage instance.
 *
 * If no instance is provided, a shared default instance will be used.
 *
 * @example
 * ```ts
 * const [age, setAge] = useMMKVNumber("user.age")
 * ```
 */

exports.useMMKVString = useMMKVString;
const useMMKVNumber = createMMKVHook((instance, key) => instance.getNumber(key));
/**
 * Use the boolean value of the given `key` from the given MMKV storage instance.
 *
 * If no instance is provided, a shared default instance will be used.
 *
 * @example
 * ```ts
 * const [isPremiumAccount, setIsPremiumAccount] = useMMKVBoolean("user.isPremium")
 * ```
 */

exports.useMMKVNumber = useMMKVNumber;
const useMMKVBoolean = createMMKVHook((instance, key) => instance.getBoolean(key));
/**
 * Use an object value of the given `key` from the given MMKV storage instance.
 *
 * If no instance is provided, a shared default instance will be used.
 *
 * The object will be serialized using `JSON`.
 *
 * @example
 * ```ts
 * const [user, setUser] = useMMKVObject<User>("user")
 * ```
 */

exports.useMMKVBoolean = useMMKVBoolean;

function useMMKVObject(key, instance) {
  const [string, setString] = useMMKVString(key, instance);
  const value = (0, _react.useMemo)(() => {
    if (string == null) return undefined;
    return JSON.parse(string);
  }, [string]);
  const setValue = (0, _react.useCallback)(v => {
    if (v == null) {
      // Clear the Value
      setString(undefined);
    } else {
      // Store the Object as a serialized Value
      setString(JSON.stringify(v));
    }
  }, [setString]);
  return [value, setValue];
}
/**
 * Listen for changes in the given MMKV storage instance.
 * If no instance is passed, the default instance will be used.
 * @param valueChangedListener The function to call whenever a value inside the storage instance changes
 * @param instance The instance to listen to changes to (or the default instance)
 *
 * @example
 * ```ts
 * useMMKVListener((key) => {
 *   console.log(`Value for "${key}" changed!`)
 * })
 * ```
 */


function useMMKVListener(valueChangedListener, instance) {
  const ref = (0, _react.useRef)(valueChangedListener);
  ref.current = valueChangedListener;
  const mmkv = instance !== null && instance !== void 0 ? instance : getDefaultInstance();
  (0, _react.useEffect)(() => {
    const listener = mmkv.addOnValueChangedListener(changedKey => {
      ref.current(changedKey);
    });
    return () => listener.remove();
  }, [mmkv]);
}
//# sourceMappingURL=hooks.js.map