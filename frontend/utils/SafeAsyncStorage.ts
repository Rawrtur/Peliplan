import AsyncStorage from '@react-native-async-storage/async-storage';

const SafeAsyncStorage = {
    getItem: async (key: string): Promise<string | null> => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            if (error instanceof Error && error.message.includes("Native module is null")) {
                return null;
            }
            console.warn('AsyncStorage getItem failed, using fallback: ', error);
            return null;
        }
    },
    setItem: async <T,>(key:string, value:T): Promise<void> => {
        try {
            if (key === "authToken") {  // Authtoken ist bereits ein String und muss deshalb nicht umgewandelt werden
                await AsyncStorage.setItem(key, JSON.stringify(value));  // wird aber trotzdem in String umgewandelt, um sicherzustellen, dass es korrekt gespeichert wird
            } else {
                const serializedValue = JSON.stringify(value);
                await AsyncStorage.setItem(String(key), serializedValue ?? null);
            } 
        } catch (error) {
            if (error instanceof Error && error.message.includes("Native module is null")) {
                return;
            }
            console.warn("AsyncStorage setItem failed, using fallback: ", error);
            return;
        }
    },
    removeItem: async (key:string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.warn("AsyncStorage removeItem failed, using fallback: ", error);
        }
    }
}

export default SafeAsyncStorage;