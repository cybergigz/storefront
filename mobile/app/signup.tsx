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

export default function SignUpScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { signup } = useAuth();
	const router = useRouter();

	const handleSignUp = async () => {
		// Validation
		if (!email || !password || !confirmPassword) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		if (!email.includes("@")) {
			Alert.alert("Error", "Please enter a valid email address");
			return;
		}

		if (password.length < 8) {
			Alert.alert("Error", "Password must be at least 8 characters");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return;
		}

		setIsLoading(true);
		const result = await signup(email, password);
		setIsLoading(false);

		if (result.success) {
			Alert.alert("Account Created", "Your account has been created successfully! You can now sign in.", [
				{
					text: "Sign In",
					onPress: () => router.replace("/login"),
				},
			]);
		} else {
			Alert.alert("Sign Up Failed", result.error || "Unable to create account");
		}
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
				<View style={styles.formContainer}>
					<Text style={styles.title}>Create Account</Text>
					<Text style={styles.subtitle}>Sign up to start shopping</Text>

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
							placeholder="At least 8 characters"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							autoCapitalize="none"
							autoCorrect={false}
							editable={!isLoading}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Confirm Password</Text>
						<TextInput
							style={styles.input}
							placeholder="Re-enter your password"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
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
						onPress={handleSignUp}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={styles.buttonText}>Create Account</Text>
						)}
					</Pressable>

					<Pressable style={styles.cancelButton} onPress={() => router.back()} disabled={isLoading}>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</Pressable>

					<View style={styles.divider} />

					<Pressable style={styles.linkButton} onPress={() => router.replace("/login")} disabled={isLoading}>
						<Text style={styles.linkText}>Already have an account? Sign In</Text>
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
