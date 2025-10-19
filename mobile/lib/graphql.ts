import { cacheExchange, createClient, fetchExchange } from "urql";
import { saleorAuthClient } from "./auth";

// Get API URL from environment variable
// Use a fallback URL to prevent app crash if env var is missing
const API_URL = process.env.EXPO_PUBLIC_SALEOR_API_URL || "https://demo.saleor.io/graphql/";

// Custom fetch function that includes authentication
const authenticatedFetch = async (url: RequestInfo | URL, options?: RequestInit) => {
	// Check if user is authenticated
	const isAuthenticated = await saleorAuthClient.isAuthenticated();

	if (isAuthenticated) {
		try {
			// Try authenticated fetch
			const response = await saleorAuthClient.fetchWithAuth(url, options);

			// Check if token expired (401 or specific error)
			if (response.status === 401) {
				console.log("Token expired, clearing and retrying without auth");
				// Clear expired tokens
				await saleorAuthClient.resetTokens();
				// Retry without authentication
				return fetch(url, options);
			}

			return response;
		} catch (error) {
			console.error("Auth fetch error:", error);
			// On error, clear tokens and retry without auth
			await saleorAuthClient.resetTokens();
			return fetch(url, options);
		}
	}

	// Fallback to regular fetch if not authenticated
	return fetch(url, options);
};

// Create URQL client for Saleor GraphQL API with authentication support
export const graphqlClient = createClient({
	url: API_URL,
	exchanges: [cacheExchange, fetchExchange],
	fetch: authenticatedFetch,
	fetchOptions: {
		headers: {
			"Content-Type": "application/json",
		},
	},
});
