import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Pressable,
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert("Error", "Please enter both email and password");
			return;
		}

		setIsLoading(true);
		const result = await login(email, password);
		setIsLoading(false);

		if (result.success) {
			Alert.alert("Success", "Logged in successfully!");
			router.back();
		} else {
			Alert.alert("Login Failed", result.error || "Invalid credentials");
		}
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
				<View style={styles.formContainer}>
					<Text style={styles.title}>Sign In</Text>
					<Text style={styles.subtitle}>Sign in to your account to continue</Text>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Email</Text>
						<TextInput
							style={styles.input}
							placeholder="your@email.com"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
							editable={!isLoading}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Password</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter your password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							autoCapitalize="none"
							autoCorrect={false}
							editable={!isLoading}
						/>
					</View>

					<Pressable
						style={({ pressed }) => [
							styles.button,
							pressed && styles.buttonPressed,
							isLoading && styles.buttonDisabled,
						]}
						onPress={handleLogin}
						disabled={isLoading}
					>
						{isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
					</Pressable>

					<Pressable style={styles.cancelButton} onPress={() => router.back()} disabled={isLoading}>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</Pressable>

					<View style={styles.divider} />

					<Pressable style={styles.linkButton} onPress={() => router.replace("/signup")} disabled={isLoading}>
						<Text style={styles.linkText}>Don't have an account? Create one</Text>
					</Pressable>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 20,
	},
	formContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#333",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		marginBottom: 32,
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 8,
		color: "#333",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#fff",
	},
	button: {
		backgroundColor: "#007AFF",
		borderRadius: 8,
		padding: 16,
		alignItems: "center",
		marginTop: 8,
	},
	buttonPressed: {
		opacity: 0.8,
	},
	buttonDisabled: {
		backgroundColor: "#ccc",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	cancelButton: {
		marginTop: 16,
		padding: 12,
		alignItems: "center",
	},
	cancelButtonText: {
		color: "#007AFF",
		fontSize: 16,
	},
	divider: {
		height: 1,
		backgroundColor: "#e0e0e0",
		marginVertical: 24,
	},
	linkButton: {
		padding: 12,
		alignItems: "center",
	},
	linkText: {
		color: "#007AFF",
		fontSize: 16,
		fontWeight: "500",
	},
});
