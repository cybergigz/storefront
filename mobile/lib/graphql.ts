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
		// Use authenticated fetch from saleorAuthClient
		return saleorAuthClient.fetchWithAuth(url, options);
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
