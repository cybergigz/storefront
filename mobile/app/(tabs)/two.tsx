import React from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCartStore } from "@/lib/cart-store";
import type { CartItem } from "@/lib/types";

export default function CartScreen() {
	const items = useCartStore((state) => state.items);
	const removeItem = useCartStore((state) => state.removeItem);
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const getTotalPrice = useCartStore((state) => state.getTotalPrice);
	const clearCart = useCartStore((state) => state.clearCart);

	const handleRemoveItem = (itemId: string, itemName: string) => {
		Alert.alert("Remove Item", `Remove ${itemName} from cart?`, [
			{ text: "Cancel", style: "cancel" },
			{ text: "Remove", style: "destructive", onPress: () => removeItem(itemId) },
		]);
	};

	const handleClearCart = () => {
		Alert.alert("Clear Cart", "Remove all items from cart?", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Clear All", style: "destructive", onPress: clearCart },
		]);
	};

	if (items.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<FontAwesome name="shopping-cart" size={80} color="#ccc" />
				<Text style={styles.emptyTitle}>Your cart is empty</Text>
				<Text style={styles.emptyText}>Add some products to get started!</Text>
			</View>
		);
	}

	const totalPrice = getTotalPrice();
	const currency = items[0]?.currency || "USD";

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Cart Items ({items.length})</Text>
				<TouchableOpacity onPress={handleClearCart}>
					<Text style={styles.clearButton}>Clear All</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				data={items}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item }) => (
					<CartItemRow
						item={item}
						onRemove={() => handleRemoveItem(item.id, item.name)}
						onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
					/>
				)}
			/>

			<View style={styles.footer}>
				<View style={styles.totalContainer}>
					<Text style={styles.totalLabel}>Total:</Text>
					<Text style={styles.totalAmount}>
						{currency} {totalPrice.toFixed(2)}
					</Text>
				</View>
				<TouchableOpacity style={styles.checkoutButton}>
					<Text style={styles.checkoutText}>Proceed to Checkout</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

function CartItemRow({
	item,
	onRemove,
	onUpdateQuantity,
}: {
	item: CartItem;
	onRemove: () => void;
	onUpdateQuantity: (quantity: number) => void;
}) {
	return (
		<View style={styles.cartItem}>
			{item.thumbnail ? (
				<Image source={{ uri: item.thumbnail }} style={styles.itemImage} />
			) : (
				<View style={styles.itemImagePlaceholder}>
					<FontAwesome name="image" size={32} color="#ccc" />
				</View>
			)}

			<View style={styles.itemDetails}>
				<Text style={styles.itemName} numberOfLines={2}>
					{item.name}
				</Text>
				{item.variantName && <Text style={styles.itemVariant}>{item.variantName}</Text>}
				<Text style={styles.itemPrice}>
					{item.currency} {item.price.toFixed(2)}
				</Text>
			</View>

			<View style={styles.itemActions}>
				<View style={styles.quantityControls}>
					<TouchableOpacity style={styles.quantityButton} onPress={() => onUpdateQuantity(item.quantity - 1)}>
						<FontAwesome name="minus" size={14} color="#2f95dc" />
					</TouchableOpacity>
					<Text style={styles.quantityText}>{item.quantity}</Text>
					<TouchableOpacity style={styles.quantityButton} onPress={() => onUpdateQuantity(item.quantity + 1)}>
						<FontAwesome name="plus" size={14} color="#2f95dc" />
					</TouchableOpacity>
				</View>

				<Text style={styles.itemTotal}>
					{item.currency} {(item.price * item.quantity).toFixed(2)}
				</Text>

				<TouchableOpacity onPress={onRemove} style={styles.removeButton}>
					<FontAwesome name="trash" size={18} color="#d32f2f" />
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
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
	},
	clearButton: {
		fontSize: 14,
		color: "#d32f2f",
		fontWeight: "600",
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
	listContent: {
		padding: 16,
	},
	cartItem: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 12,
		marginBottom: 12,
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	itemImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: "#f0f0f0",
	},
	itemImagePlaceholder: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: "#f0f0f0",
		alignItems: "center",
		justifyContent: "center",
	},
	itemDetails: {
		flex: 1,
		marginLeft: 12,
		justifyContent: "center",
	},
	itemName: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 4,
	},
	itemVariant: {
		fontSize: 14,
		color: "#666",
		marginBottom: 4,
	},
	itemPrice: {
		fontSize: 14,
		color: "#2f95dc",
		fontWeight: "600",
	},
	itemActions: {
		alignItems: "flex-end",
		justifyContent: "space-between",
		marginLeft: 12,
	},
	quantityControls: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		borderRadius: 4,
		padding: 4,
	},
	quantityButton: {
		padding: 8,
	},
	quantityText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginHorizontal: 12,
		minWidth: 24,
		textAlign: "center",
	},
	itemTotal: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	removeButton: {
		padding: 8,
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
