import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import ProductPage from '../pages/ProductPage';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  variantId: string; // Unique identifier for product+size combination
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'variantId'> & { size: string }, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

 const addToCart = (
  product: Omit<CartItem, 'quantity' | 'variantId'> & { size: string },
  quantity: number = 1
) => {
  setCartItems(prevItems => {
    // const variantId = ${product.id}_${product.size}; // ✅ Unique per size
    const variantId = ⁠ ${product.id}_${product.size} ⁠;

    const existingItemIndex = prevItems.findIndex(item => item.variantId === variantId);

    if (existingItemIndex >= 0) {
      // ✅ Item with same variant already exists: increase quantity
      const updatedItems = [...prevItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      return updatedItems;
    }

    // ✅ Item doesn't exist: add as new with variantId and quantity
    return [...prevItems, { ...product, quantity, variantId }];
  });

  setIsCartOpen(true); // ✅ Opens the cart when something is added
};



  // const addToCart = (
  //   product: Omit<CartItem, 'quantity' | 'variantId'> & { size: string },
  //   quantity: number = 1
  // ) => {
  //   setCartItems(prevItems => {
  //     // Create a unique variant ID combining product ID and size
  //     const variantId = ⁠ ${product.id}_${product.size} ⁠;
      
  //     const existingItemIndex = prevItems.findIndex(item => item.variantId === variantId);

  //     if (existingItemIndex >= 0) {
  //       // Update quantity if item exists
  //       const updatedItems = [...prevItems];
  //       updatedItems[existingItemIndex] = {
  //         ...updatedItems[existingItemIndex],
  //         quantity: updatedItems[existingItemIndex].quantity + quantity
  //       };
  //       return updatedItems;
  //     }

  //     // Add new item if it doesn't exist
  //     return [...prevItems, { ...product, quantity, variantId }];
  //   });
  //   // Open cart when adding items
  //   setIsCartOpen(true);
  // };

  const removeFromCart = (variantId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
