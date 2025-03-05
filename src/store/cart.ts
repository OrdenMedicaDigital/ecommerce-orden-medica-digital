import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string;
}

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
  items: [],
  isCartOpen: false,
  
  addItem: (item: CartItem) => set((state) => {
    const existingItem = state.items.find((i) => i.id === item.id);
    
    if (existingItem) {
      return {
        items: state.items.map((i) => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };
    }
    
    return { 
      items: [...state.items, { ...item, quantity: 1 }],
    };
  }),
  
  openCart: () => set({ isCartOpen: true }),
  
  closeCart: () => set({ isCartOpen: false }),
  
  removeItem: (id: string) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  
  updateQuantity: (id: string, quantity: number) => set((state) => ({
    items: state.items.map((item) => 
      item.id === id 
        ? { ...item, quantity }
        : item
    ),
  })),
  
  clearCart: () => set({ items: [] }),
  
  get totalItems() {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },
  
  get totalPrice() {
    return get().items.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);
  },
}),
{
  name: 'cart-storage',
}
));