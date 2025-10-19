import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * Secure storage adapter for Saleor Auth SDK
 * Uses expo-secure-store on iOS/Android and AsyncStorage as fallback
 */
export const secureStorage = {
	/**
	 * Get item from secure storage
	 */
	getItem: async (key: string): Promise<string | null> => {
		try {
			// Use SecureStore on native platforms
			if (Platform.OS === "ios" || Platform.OS === "android") {
				return await SecureStore.getItemAsync(key);
			}
			// Fallback to AsyncStorage (less secure, for web/dev)
			return await AsyncStorage.getItem(key);
		} catch (error) {
			console.error("Error getting item from secure storage:", error);
			return null;
		}
	},

	/**
	 * Set item in secure storage
	 */
	setItem: async (key: string, value: string): Promise<void> => {
		try {
			// Use SecureStore on native platforms
			if (Platform.OS === "ios" || Platform.OS === "android") {
				await SecureStore.setItemAsync(key, value);
			} else {
				// Fallback to AsyncStorage
				await AsyncStorage.setItem(key, value);
			}
		} catch (error) {
			console.error("Error setting item in secure storage:", error);
		}
	},

	/**
	 * Remove item from secure storage
	 */
	removeItem: async (key: string): Promise<void> => {
		try {
			// Use SecureStore on native platforms
			if (Platform.OS === "ios" || Platform.OS === "android") {
				await SecureStore.deleteItemAsync(key);
			} else {
				// Fallback to AsyncStorage
				await AsyncStorage.removeItem(key);
			}
		} catch (error) {
			console.error("Error removing item from secure storage:", error);
		}
	},
};
