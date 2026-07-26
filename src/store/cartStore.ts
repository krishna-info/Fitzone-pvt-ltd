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
  color?: string;
}

export interface CartVariantId {
  productId: string;
  size?: string;
  color?: string;
}

export const getVariantKey = (item: CartVariantId) =>
  `${item.productId}::${item.size || ''}::${item.color || ''}`;

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (target: CartVariantId | string) => void;
  updateQuantity: (target: CartVariantId | string, quantity: number) => void;
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
        const itemKey = getVariantKey(item);
        const existing = get().items.find(i => getVariantKey(i) === itemKey);
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              getVariantKey(i) === itemKey
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set(state => ({ items: [...state.items, { ...item, quantity: 1 }] }));
        }
      },
      removeItem: (target) => {
        const targetKey = typeof target === 'string' ? target : getVariantKey(target);
        set(state => ({
          items: state.items.filter(i => getVariantKey(i) !== targetKey && i.productId !== target)
        }));
      },
      updateQuantity: (target, quantity) => {
        const targetKey = typeof target === 'string' ? target : getVariantKey(target);
        if (quantity < 1) {
          get().removeItem(target);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            (getVariantKey(i) === targetKey || i.productId === target) ? { ...i, quantity } : i
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
