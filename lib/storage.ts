import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
    setBoolean: async (key: string, value: boolean) =>
        await AsyncStorage.setItem(key, String(value)),

    getBoolean: async (key: string) => {
        const val = await AsyncStorage.getItem(key);
        return val === "true";
    },

    remove: async (key: string) =>
        await AsyncStorage.removeItem(key),
};