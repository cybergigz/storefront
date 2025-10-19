import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { saleorAuthClient } from "./auth";

// GraphQL queries as plain strings for direct fetch usage
const CURRENT_USER_QUERY = `
	query CurrentUser {
		me {
			id
			email
			firstName
			lastName
			avatar {
				url
				alt
			}
		}
	}
`;

const LOGIN_MUTATION = `
	mutation Login($email: String!, $password: String!) {
		tokenCreate(email: $email, password: $password) {
			token
			refreshToken
			csrfToken
			user {
				id
				email
				firstName
				lastName
				avatar {
					url
					alt
				}
			}
			errors {
				field
				message
				code
			}
		}
	}
`;

const SIGNUP_MUTATION = `
	mutation SignUp($email: String!, $password: String!, $redirectUrl: String!) {
		accountRegister(input: { email: $email, password: $password, redirectUrl: $redirectUrl }) {
			user {
				id
				email
				firstName
				lastName
			}
			errors {
				field
				message
				code
			}
		}
	}
`;

interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	avatar?: {
		url: string;
		alt?: string;
	};
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
	signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch current user on mount
	useEffect(() => {
		refreshUser();
	}, []);

	const refreshUser = async () => {
		setIsLoading(true);
		try {
			const isAuthenticated = await saleorAuthClient.isAuthenticated();

			if (isAuthenticated) {
				const response = await saleorAuthClient.fetchWithAuth(
					process.env.EXPO_PUBLIC_SALEOR_API_URL || "https://demo.saleor.io/graphql/",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							query: CURRENT_USER_QUERY,
						}),
					},
				);

				const data = await response.json();

				if (data.data?.me) {
					setUser(data.data.me);
				} else {
					setUser(null);
				}
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("Error fetching user:", error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
		try {
			const response = await fetch(
				process.env.EXPO_PUBLIC_SALEOR_API_URL || "https://demo.saleor.io/graphql/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: LOGIN_MUTATION,
						variables: { email, password },
					}),
				},
			);

			const data = await response.json();

			if (data.errors) {
				return { success: false, error: data.errors[0]?.message || "Login failed" };
			}

			const result = data.data?.tokenCreate;

			if (result?.errors?.length > 0) {
				return { success: false, error: result.errors[0].message };
			}

			if (result?.token && result?.refreshToken) {
				// Store tokens using the auth client
				await saleorAuthClient.setTokens({
					access: result.token,
					refresh: result.refreshToken,
				});

				// Set user data
				if (result.user) {
					setUser(result.user);
				}

				return { success: true };
			}

			return { success: false, error: "Invalid credentials" };
		} catch (error) {
			console.error("Login error:", error);
			return { success: false, error: "Network error. Please try again." };
		}
	};

	const signup = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
		try {
			const response = await fetch(
				process.env.EXPO_PUBLIC_SALEOR_API_URL || "https://demo.saleor.io/graphql/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: SIGNUP_MUTATION,
						variables: {
							email,
							password,
							redirectUrl: "app://account", // Mobile deep link
						},
					}),
				},
			);

			const data = await response.json();

			if (data.errors) {
				return { success: false, error: data.errors[0]?.message || "Sign up failed" };
			}

			const result = data.data?.accountRegister;

			if (result?.errors?.length > 0) {
				return { success: false, error: result.errors[0].message };
			}

			if (result?.user) {
				// Account created successfully, but not logged in yet
				// User may need to verify email depending on Saleor settings
				return { success: true };
			}

			return { success: false, error: "Sign up failed" };
		} catch (error) {
			console.error("Sign up error:", error);
			return { success: false, error: "Network error. Please try again." };
		}
	};

	const logout = async () => {
		try {
			// Clear tokens
			await saleorAuthClient.resetTokens();
			setUser(null);
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isLoading,
				login,
				signup,
				logout,
				refreshUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
