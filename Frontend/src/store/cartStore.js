import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, size, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product._id && item.size === size
          );
          
          // Determine price: use size-specific price if available, otherwise base price
          const itemPrice = product.sizePrices && product.sizePrices[size] 
            ? product.sizePrices[size] 
            : product.price;
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product._id && item.size === size
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          
          return {
            items: [
              ...state.items,
              {
                productId: product._id,
                name: product.name,
                price: itemPrice,
                image: product.images[0],
                size,
                quantity
              }
            ]
          };
        });
      },
      
      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.size === size)
          )
        }));
      },
      
      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);
