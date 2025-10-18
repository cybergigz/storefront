import React from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "urql";
import { PRODUCT_LIST_QUERY } from "@/lib/queries";

const CHANNEL = "default-channel"; // Default Saleor channel

export default function ProductListScreen() {
	const router = useRouter();
	const [result] = useQuery({
		query: PRODUCT_LIST_QUERY,
		variables: { first: 20, channel: CHANNEL },
	});

	const { data, fetching, error } = result;

	if (fetching) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color="#000" />
				<Text style={styles.loadingText}>Loading products...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.errorText}>Error loading products</Text>
				<Text style={styles.errorDetail}>{error.message}</Text>
				<Text style={styles.hint}>Make sure to configure EXPO_PUBLIC_SALEOR_API_URL in .env file</Text>
			</View>
		);
	}

	const products = data?.products?.edges || [];

	if (products.length === 0) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.emptyText}>No products found</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={products}
				keyExtractor={(item) => item.node.id}
				numColumns={2}
				contentContainerStyle={styles.listContent}
				renderItem={({ item }) => {
					const product = item.node;
					const price = product.pricing?.priceRange?.start?.gross;

					return (
						<Pressable style={styles.productCard} onPress={() => router.push(`/product/${product.id}`)}>
							{product.thumbnail?.url ? (
								<Image source={{ uri: product.thumbnail.url }} style={styles.productImage} />
							) : (
								<View style={styles.placeholderImage}>
									<Text>No Image</Text>
								</View>
							)}
							<View style={styles.productInfo}>
								<Text style={styles.productName} numberOfLines={2}>
									{product.name}
								</Text>
								{price && (
									<Text style={styles.productPrice}>
										{price.currency} {price.amount}
									</Text>
								)}
							</View>
						</Pressable>
					);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	centerContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	listContent: {
		padding: 8,
	},
	productCard: {
		flex: 1,
		margin: 8,
		backgroundColor: "#fff",
		borderRadius: 8,
		overflow: "hidden",
		// Android elevation
		elevation: 2,
		// iOS and Web shadows
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
			},
			web: {
				boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
			},
		}),
	},
	productImage: {
		width: "100%",
		height: 150,
		backgroundColor: "#f0f0f0",
	},
	placeholderImage: {
		width: "100%",
		height: 150,
		backgroundColor: "#e0e0e0",
		alignItems: "center",
		justifyContent: "center",
	},
	productInfo: {
		padding: 12,
	},
	productName: {
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 4,
		color: "#333",
	},
	productPrice: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#2f95dc",
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: "#666",
	},
	errorText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#d32f2f",
		marginBottom: 8,
	},
	errorDetail: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		marginBottom: 12,
	},
	hint: {
		fontSize: 12,
		color: "#999",
		textAlign: "center",
		fontStyle: "italic",
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
	},
});
