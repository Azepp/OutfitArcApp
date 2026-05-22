import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV();

export const storage = {
    setBoolean: (key: string, value: boolean) =>
        mmkv.set(key, value),

    getBoolean: (key: string) =>
        mmkv.getBoolean(key) ?? false,

    remove: (key: string) =>
        mmkv.delete(key),
};