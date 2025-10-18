// Cart item type
export interface CartItem {
	id: string;
	productId: string;
	variantId?: string;
	name: string;
	slug: string;
	price: number;
	currency: string;
	quantity: number;
	thumbnail?: string;
	variantName?: string;
}

// Product data from GraphQL
export interface Product {
	id: string;
	name: string;
	slug: string;
	description?: string;
	thumbnail?: {
		url: string;
		alt?: string;
	};
	pricing?: {
		priceRange?: {
			start?: {
				gross?: {
					amount: number;
					currency: string;
				};
			};
		};
	};
}

// Product variant
export interface ProductVariant {
	id: string;
	name: string;
	pricing?: {
		price?: {
			gross?: {
				amount: number;
				currency: string;
			};
		};
	};
}
