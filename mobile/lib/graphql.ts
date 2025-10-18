import { cacheExchange, createClient, fetchExchange } from "urql";

// Get API URL from environment variable
// Use a fallback URL to prevent app crash if env var is missing
const API_URL = process.env.EXPO_PUBLIC_SALEOR_API_URL || "https://demo.saleor.io/graphql/";

// Create URQL client for Saleor GraphQL API
export const graphqlClient = createClient({
	url: API_URL,
	exchanges: [cacheExchange, fetchExchange],
	fetchOptions: () => {
		return {
			headers: {
				"Content-Type": "application/json",
			},
		};
	},
});
