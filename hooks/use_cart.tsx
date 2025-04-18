import { CartItem, CartState } from "@/types/cart";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            // Vérifier le stock avant d'augmenter la quantité
            const newQuantity = existingItem.quantity + 1;
            if (newQuantity > existingItem.stock) {
              return state;
            }
            return {
              ...state,
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: newQuantity } : i
              ),
            };
          }
          return {
            ...state,
            items: [...state.items, { ...item, quantity: 1 }],
          };
        }),
      removeItem: (itemId) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === itemId);
          if (existingItem && existingItem.quantity > 1) {
            return {
              ...state,
              items: state.items.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
              ),
            };
          }
          return {
            ...state,
            items: state.items.filter((i) => i.id !== itemId),
          };
        }),
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "cart-storage",
    }
  )
);