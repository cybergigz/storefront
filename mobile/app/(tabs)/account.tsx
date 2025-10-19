import React from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function AccountScreen() {
	const { user, isAuthenticated, isLoading, logout } = useAuth();
	const router = useRouter();

	const handleLogout = () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Logout",
				style: "destructive",
				onPress: async () => {
					await logout();
					Alert.alert("Logged out", "You have been logged out successfully");
				},
			},
		]);
	};

	if (isLoading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color="#007AFF" />
				<Text style={styles.loadingText}>Loading account...</Text>
			</View>
		);
	}

	if (!isAuthenticated || !user) {
		return (
			<View style={styles.centerContainer}>
				<FontAwesome name="user-circle" size={80} color="#ccc" style={styles.icon} />
				<Text style={styles.title}>Not Signed In</Text>
				<Text style={styles.subtitle}>Sign in to view your account and order history</Text>
				<Pressable
					style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
					onPress={() => router.push("/login")}
				>
					<Text style={styles.buttonText}>Sign In</Text>
				</Pressable>
				<Pressable
					style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
					onPress={() => router.push("/signup")}
				>
					<Text style={styles.secondaryButtonText}>Create Account</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
			<View style={styles.header}>
				{user.avatar?.url ? (
					<View style={styles.avatarContainer}>
						<Text style={styles.avatarText}>{user.firstName?.[0] || user.email[0].toUpperCase()}</Text>
					</View>
				) : (
					<View style={styles.avatarContainer}>
						<FontAwesome name="user" size={40} color="#fff" />
					</View>
				)}

				<Text style={styles.name}>
					{user.firstName || user.lastName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "User"}
				</Text>
				<Text style={styles.email}>{user.email}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Account Information</Text>

				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Email</Text>
					<Text style={styles.infoValue}>{user.email}</Text>
				</View>

				{user.firstName && (
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>First Name</Text>
						<Text style={styles.infoValue}>{user.firstName}</Text>
					</View>
				)}

				{user.lastName && (
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Last Name</Text>
						<Text style={styles.infoValue}>{user.lastName}</Text>
					</View>
				)}
			</View>

			<View style={styles.section}>
				<Pressable
					style={({ pressed }) => [styles.logoutButton, pressed && styles.buttonPressed]}
					onPress={handleLogout}
				>
					<FontAwesome name="sign-out" size={20} color="#ff3b30" />
					<Text style={styles.logoutButtonText}>Logout</Text>
				</Pressable>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	scrollContent: {
		padding: 20,
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	icon: {
		marginBottom: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#333",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginBottom: 32,
		paddingHorizontal: 20,
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: "#666",
	},
	button: {
		backgroundColor: "#007AFF",
		borderRadius: 8,
		paddingVertical: 14,
		paddingHorizontal: 32,
		minWidth: 200,
		alignItems: "center",
	},
	buttonPressed: {
		opacity: 0.8,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	secondaryButton: {
		backgroundColor: "#fff",
		borderRadius: 8,
		paddingVertical: 14,
		paddingHorizontal: 32,
		minWidth: 200,
		alignItems: "center",
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#007AFF",
	},
	secondaryButtonText: {
		color: "#007AFF",
		fontSize: 16,
		fontWeight: "600",
	},
	header: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 24,
		alignItems: "center",
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	avatarContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#007AFF",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	avatarText: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#fff",
	},
	name: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 4,
	},
	email: {
		fontSize: 16,
		color: "#666",
	},
	section: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 20,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 16,
	},
	infoRow: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	infoLabel: {
		fontSize: 14,
		color: "#666",
		marginBottom: 4,
	},
	infoValue: {
		fontSize: 16,
		color: "#333",
		fontWeight: "500",
	},
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
		gap: 12,
	},
	logoutButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#ff3b30",
	},
});
