import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  imageUrl?: string;
  price?: number;
  isEnquiryOnly?: boolean;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const existing = get().items.find(
          i => i.productId === item.productId && i.size === item.size
        );
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              (i.productId === item.productId && i.size === item.size)
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set(state => ({ items: [...state.items, { ...item, quantity: 1 }] }));
        }
      },
      removeItem: (productId) =>
        set(state => ({ items: state.items.filter(i => i.productId !== productId) })),
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: 'fitzone-shopping-cart' }
  )
);
