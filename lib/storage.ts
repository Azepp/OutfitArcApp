import * as SecureStore from "expo-secure-store";

export const storage = {
    setBoolean: (key: string, value: boolean) =>
        SecureStore.setItemAsync(key, String(value)),

    getBoolean: async (key: string) => {
        const val = await SecureStore.getItemAsync(key);
        return val === "true";
    },

    remove: (key: string) => SecureStore.deleteItemAsync(key),
};