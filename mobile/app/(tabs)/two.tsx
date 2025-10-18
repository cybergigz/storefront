import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function CartScreen() {
	// Placeholder cart - will be replaced with actual cart state
	const cartItems: any[] = [];

	if (cartItems.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<FontAwesome name="shopping-cart" size={80} color="#ccc" />
				<Text style={styles.emptyTitle}>Your cart is empty</Text>
				<Text style={styles.emptyText}>Add some products to get started!</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				{/* Cart items will go here */}
				<Text style={styles.title}>Cart Items ({cartItems.length})</Text>
			</View>

			<View style={styles.footer}>
				<View style={styles.totalContainer}>
					<Text style={styles.totalLabel}>Total:</Text>
					<Text style={styles.totalAmount}>$0.00</Text>
				</View>
				<TouchableOpacity style={styles.checkoutButton}>
					<Text style={styles.checkoutText}>Proceed to Checkout</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	emptyContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	emptyTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginTop: 24,
		marginBottom: 8,
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
	content: {
		flex: 1,
		padding: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
	footer: {
		backgroundColor: "#fff",
		padding: 16,
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
	},
	totalContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	totalLabel: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
	},
	totalAmount: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#2f95dc",
	},
	checkoutButton: {
		backgroundColor: "#2f95dc",
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 8,
		alignItems: "center",
	},
	checkoutText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});
