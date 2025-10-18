import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "urql";
import { PRODUCT_DETAIL_QUERY } from "@/lib/queries";
import { useCartStore } from "@/lib/cart-store";

const CHANNEL = "default-channel";

export default function ProductDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const addItem = useCartStore((state) => state.addItem);
	const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

	const [result] = useQuery({
		query: PRODUCT_DETAIL_QUERY,
		variables: { id, channel: CHANNEL },
	});

	const { data, fetching, error } = result;

	if (fetching) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color="#000" />
				<Text style={styles.loadingText}>Loading product...</Text>
			</View>
		);
	}

	if (error || !data?.product) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.errorText}>Product not found</Text>
				<TouchableOpacity style={styles.button} onPress={() => router.back()}>
					<Text style={styles.buttonText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const product = data.product;
	const price = product.pricing?.priceRange?.start?.gross;
	const mainImage = product.media?.[0]?.url || product.thumbnail?.url;

	const handleAddToCart = () => {
		if (!price) {
			Alert.alert("Error", "Product price not available");
			return;
		}

		// Check if product has multiple variants
		const hasMultipleVariants = product.variants && product.variants.length > 1;

		// If product has multiple variants and none selected, show alert
		if (hasMultipleVariants && !selectedVariant) {
			Alert.alert("Select Variant", "Please select a variant before adding to cart");
			return;
		}

		// Auto-select the only variant if there's just one
		const effectiveVariantId = selectedVariant || product.variants?.[0]?.id;
		const variant = effectiveVariantId
			? product.variants?.find((v: any) => v.id === effectiveVariantId)
			: null;

		const itemPrice = variant?.pricing?.price?.gross?.amount || price.amount;
		const itemCurrency = variant?.pricing?.price?.gross?.currency || price.currency;

		addItem({
			productId: product.id,
			variantId: variant?.id,
			name: product.name,
			slug: product.slug,
			price: itemPrice,
			currency: itemCurrency,
			thumbnail: product.thumbnail?.url,
			variantName: variant?.name,
		});

		Alert.alert(
			"Added to Cart",
			`${product.name}${variant ? ` (${variant.name})` : ""} has been added to your cart`,
			[
				{ text: "Continue Shopping", style: "cancel" },
				{ text: "View Cart", onPress: () => router.push("/(tabs)/two") },
			],
		);
	};

	return (
		<ScrollView style={styles.container}>
			{mainImage && <Image source={{ uri: mainImage }} style={styles.mainImage} resizeMode="cover" />}

			<View style={styles.content}>
				<Text style={styles.productName}>{product.name}</Text>

				{price && (
					<Text style={styles.price}>
						{price.currency} {price.amount}
					</Text>
				)}

				{product.description && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Description</Text>
						<Text style={styles.description}>{product.description}</Text>
					</View>
				)}

				{product.variants && product.variants.length > 1 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Select Variant</Text>
						{product.variants.map((variant: any) => {
							const variantPrice = variant.pricing?.price?.gross;
							const isSelected = selectedVariant === variant.id;
							return (
								<TouchableOpacity
									key={variant.id}
									style={[styles.variant, isSelected && styles.variantSelected]}
									onPress={() => setSelectedVariant(variant.id)}
								>
									<Text style={[styles.variantName, isSelected && styles.variantNameSelected]}>
										{variant.name}
									</Text>
									{variantPrice && (
										<Text style={[styles.variantPrice, isSelected && styles.variantPriceSelected]}>
											{variantPrice.currency} {variantPrice.amount}
										</Text>
									)}
								</TouchableOpacity>
							);
						})}
					</View>
				)}

				<TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
					<Text style={styles.addToCartText}>Add to Cart</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	centerContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	mainImage: {
		width: "100%",
		height: 300,
		backgroundColor: "#f0f0f0",
	},
	content: {
		padding: 16,
	},
	productName: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
	},
	price: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#2f95dc",
		marginBottom: 16,
	},
	section: {
		marginTop: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 12,
	},
	description: {
		fontSize: 16,
		color: "#666",
		lineHeight: 24,
	},
	variant: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: "#f5f5f5",
		borderRadius: 8,
		marginBottom: 8,
		borderWidth: 2,
		borderColor: "transparent",
	},
	variantSelected: {
		backgroundColor: "#e3f2fd",
		borderColor: "#2f95dc",
	},
	variantName: {
		fontSize: 16,
		color: "#333",
	},
	variantNameSelected: {
		fontWeight: "600",
		color: "#2f95dc",
	},
	variantPrice: {
		fontSize: 16,
		fontWeight: "600",
		color: "#666",
	},
	variantPriceSelected: {
		color: "#2f95dc",
	},
	addToCartButton: {
		backgroundColor: "#2f95dc",
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 32,
		marginBottom: 32,
	},
	addToCartText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
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
		marginBottom: 16,
	},
	button: {
		backgroundColor: "#2f95dc",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});
