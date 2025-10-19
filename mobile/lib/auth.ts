import { secureStorage } from "./secure-storage";

// Get API URL from environment variable
const saleorApiUrl = process.env.EXPO_PUBLIC_SALEOR_API_URL || "https://demo.saleor.io/graphql/";

const ACCESS_TOKEN_KEY = "saleor_access_token";
const REFRESH_TOKEN_KEY = "saleor_refresh_token";

/**
 * Native React Native Auth Client (no browser dependencies)
 * Manually handles token storage and refresh
 */
export const saleorAuthClient = {
	/**
	 * Check if user is authenticated
	 */
	isAuthenticated: async (): Promise<boolean> => {
		const accessToken = await secureStorage.getItem(ACCESS_TOKEN_KEY);
		return !!accessToken;
	},

	/**
	 * Get current access token
	 */
	getAccessToken: async (): Promise<string | null> => {
		return await secureStorage.getItem(ACCESS_TOKEN_KEY);
	},

	/**
	 * Set authentication tokens
	 */
	setTokens: async (tokens: { access: string; refresh: string }): Promise<void> => {
		await secureStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
		await secureStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
	},

	/**
	 * Clear all tokens (logout)
	 */
	resetTokens: async (): Promise<void> => {
		await secureStorage.removeItem(ACCESS_TOKEN_KEY);
		await secureStorage.removeItem(REFRESH_TOKEN_KEY);
	},

	/**
	 * Fetch with authentication headers
	 */
	fetchWithAuth: async (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
		const accessToken = await secureStorage.getItem(ACCESS_TOKEN_KEY);

		const headers = new Headers(options?.headers);
		if (accessToken) {
			headers.set("Authorization", `Bearer ${accessToken}`);
		}

		return fetch(url, {
			...options,
			headers,
		});
	},
};

console.log("Auth client initialized with API:", saleorApiUrl);
