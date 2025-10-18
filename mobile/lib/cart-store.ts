import { create } from "zustand";
import type { CartItem } from "./types";

interface CartStore {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
	removeItem: (itemId: string) => void;
	updateQuantity: (itemId: string, quantity: number) => void;
	clearCart: () => void;
	getTotalItems: () => number;
	getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
	items: [],

	addItem: (item) => {
		set((state) => {
			// Check if item already exists in cart
			const existingItemIndex = state.items.findIndex(
				(cartItem) => cartItem.productId === item.productId && cartItem.variantId === item.variantId,
			);

			if (existingItemIndex !== -1) {
				// Item exists, update quantity
				const newItems = [...state.items];
				newItems[existingItemIndex].quantity += item.quantity || 1;
				return { items: newItems };
			}

			// Item doesn't exist, add new item
			const newItem: CartItem = {
				...item,
				id: `${item.productId}-${item.variantId || "default"}-${Date.now()}`,
				quantity: item.quantity || 1,
			};

			return { items: [...state.items, newItem] };
		});
	},

	removeItem: (itemId) => {
		set((state) => ({
			items: state.items.filter((item) => item.id !== itemId),
		}));
	},

	updateQuantity: (itemId, quantity) => {
		if (quantity <= 0) {
			get().removeItem(itemId);
			return;
		}

		set((state) => ({
			items: state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
		}));
	},

	clearCart: () => {
		set({ items: [] });
	},

	getTotalItems: () => {
		return get().items.reduce((total, item) => total + item.quantity, 0);
	},

	getTotalPrice: () => {
		return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
	},
}));
