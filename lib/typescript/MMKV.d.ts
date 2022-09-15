interface Listener {
    remove: () => void;
}
/**
 * Used for configuration of a single MMKV instance.
 */
export interface MMKVConfiguration {
    /**
     * The MMKV instance's ID. If you want to use multiple instances, make sure to use different IDs!
     *
     * @example
     * ```ts
     * const userStorage = new MMKV({ id: `user-${userId}-storage` })
     * const globalStorage = new MMKV({ id: 'global-app-storage' })
     * ```
     *
     * @default 'mmkv.default'
     */
    id: string;
    /**
     * The MMKV instance's root path. By default, MMKV stores file inside `$(Documents)/mmkv/`. You can customize MMKV's root directory on MMKV initialization:
     *
     * @example
     * ```ts
     * const temporaryStorage = new MMKV({ path: '/tmp/' })
     * ```
     */
    path?: string;
    /**
     * The MMKV instance's encryption/decryption key. By default, MMKV stores all key-values in plain text on file, relying on iOS's sandbox to make sure the file is encrypted. Should you worry about information leaking, you can choose to encrypt MMKV.
     *
     * Encryption keys can have a maximum length of 16 bytes.
     *
     * @example
     * ```ts
     * const secureStorage = new MMKV({ encryptionKey: 'my-encryption-key!' })
     * ```
     */
    encryptionKey?: string;
}
/**
 * Represents a single MMKV instance.
 */
interface MMKVInterface {
    /**
     * Set a value for the given `key`.
     */
    set: (key: string, value: boolean | string | number) => void;
    /**
     * Get the boolean value for the given `key`, or `undefined` if it does not exist.
     *
     * @default undefined
     */
    getBoolean: (key: string) => boolean | undefined;
    /**
     * Get the string value for the given `key`, or `undefined` if it does not exist.
     *
     * @default undefined
     */
    getString: (key: string) => string | undefined;
    /**
     * Get the number value for the given `key`, or `undefined` if it does not exist.
     *
     * @default undefined
     */
    getNumber: (key: string) => number | undefined;
    /**
     * Checks whether the given `key` is being stored in this MMKV instance.
     */
    contains: (key: string) => boolean;
    /**
     * Delete the given `key`.
     */
    delete: (key: string) => void;
    /**
     * Get all keys.
     *
     * @default []
     */
    getAllKeys: () => string[];
    /**
     * Delete all keys.
     */
    clearAll: () => void;
    /**
     * Sets (or updates) the encryption-key to encrypt all data in this MMKV instance with.
     *
     * To remove encryption, pass `undefined` as a key.
     *
     * Encryption keys can have a maximum length of 16 bytes.
     */
    recrypt: (key: string | undefined) => void;
    /**
     * Adds a value changed listener. The Listener will be called whenever any value
     * in this storage instance changes (set or delete).
     *
     * To unsubscribe from value changes, call `remove()` on the Listener.
     */
    addOnValueChangedListener: (onValueChanged: (key: string) => void) => Listener;
}
export declare type NativeMMKV = Pick<MMKVInterface, 'clearAll' | 'contains' | 'delete' | 'getAllKeys' | 'getBoolean' | 'getNumber' | 'getString' | 'set' | 'recrypt'>;
/**
 * A single MMKV instance.
 */
export declare class MMKV implements MMKVInterface {
    private nativeInstance;
    private functionCache;
    private id;
    /**
     * Creates a new MMKV instance with the given Configuration.
     * If no custom `id` is supplied, `'mmkv.default'` will be used.
     */
    constructor(configuration?: MMKVConfiguration);
    private get onValueChangedListeners();
    private getFunctionFromCache;
    private onValuesChanged;
    set(key: string, value: boolean | string | number): void;
    getBoolean(key: string): boolean | undefined;
    getString(key: string): string | undefined;
    getNumber(key: string): number | undefined;
    contains(key: string): boolean;
    delete(key: string): void;
    getAllKeys(): string[];
    clearAll(): void;
    recrypt(key: string | undefined): void;
    toString(): string;
    toJSON(): object;
    addOnValueChangedListener(onValueChanged: (key: string) => void): Listener;
}
export {};
