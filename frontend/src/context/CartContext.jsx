import { createContext, useContext, useState, useEffect } from "react";
import api from "../hooks/api";
import {
  getCartItems,
  updateCartItemQuantity,
  clearCart,
  getGuestCart,
  addToGuestCart,
  updateGuestCartItem,
  removeGuestCartItem,
  mergeGuestDataToUser
} from "../hooks/services";
import { useAuth } from "../authResource/useAuth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { session } = useAuth();
  const isGuest = !session?.user;

  async function refreshCart() {
    if (isGuest) {
      const guestCart = getGuestCart();
      setCart(guestCart);
    } else {
      try {
        const user_id = session.user.id;
        const data = await getCartItems(user_id);
        setCart(data);
      } catch (error) {
        console.error('Error loading user cart:', error);
        setCart({ items: [] });
      }
    }
  }

  // Handle login: merge guest data
  useEffect(() => {
    if (session?.user) {
      // User just logged in, merge guest data
      const mergeData = async () => {
        const result = await mergeGuestDataToUser(session.user.id);
        if (result.success) {
          // Refresh cart to show merged data
          await refreshCart();
        }
      };
      mergeData();
    } else {
      // User logged out, refresh to show guest cart
      refreshCart();
    }
  }, [session?.user]);

  useEffect(() => {
    refreshCart();
  }, []);

  const updateQuantity = async (itemId, newQty, container, product_id) => {
    try {
      if (isGuest) {
        updateGuestCartItem(itemId, newQty);
      } else {
        await updateCartItemQuantity(itemId, newQty, container, product_id);
      }
      await refreshCart();
    } catch (err) {
      console.error("Failed to update cart item:", err);
    }
  };

  const clearCartItems = async () => {
    try {
      if (isGuest) {
        // For guest, just clear localStorage
        setCart({ items: [] });
      } else {
        await clearCart(cart.id);
        await refreshCart();
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const addItem = async (product, quantity = 100, size = null, color = null) => {
    try {
      if (isGuest) {
        addToGuestCart(product, quantity, size, color);
      } else {
        // For authenticated users, add via API
        const payload = {
          user_id: session.user.id,
          items: [{ product_id: product.id, quantity, size, color }]
        };
        await api.post('/carts/carts', payload);
      }
      await refreshCart();
    } catch (err) {
      console.error("Failed to add item to cart:", err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      if (isGuest) {
        removeGuestCartItem(itemId);
      } else {
        // Find the cart item and remove it
        const item = cart.items.find(i => i.id === itemId);
        if (item && cart.id) {
          await api.delete(`/carts/carts/${cart.id}/items/${itemId}`);
        }
      }
      await refreshCart();
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };

  const cartItemCount = cart?.items?.length ?? 0;

  return (
    <CartContext.Provider value={{
      cart,
      cartItemCount,
      refreshCart,
      updateQuantity,
      clearCartItems,
      addItem,
      removeItem,
      isGuest
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);







// import { createContext, useContext, useState, useEffect } from "react";
// import {
//   getCartItems,
//   getGuestCart,
//   removeGuestCartItem,
//   userAddItem,
//   userRemoveItem,
//   addToGuestCart,
//   setGuestCartQuantity
// } from "../hooks/services";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState({ items: [] });

//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const isGuest = !user;
//   const userId = user?.id;

//   async function refreshCart() {
//     if (isGuest) {
//       const data = await getGuestCart();
//       setCart(data || { items: [] });
//     } else {
//       const data = await getCartItems();
//       setCart(data || { items: [] });
//     }
//   }

//   async function addItem(product_id, { quantity = 1, size = null, color = null } = {}) {
//     if (isGuest) {
//       await addToGuestCart(product_id, quantity, size, color);
//     } else {
//       await userAddItem(userId, product_id, quantity, size, color);
//     }
//     await refreshCart();
//   }

//   async function removeItem(product_id_or_itemId) {
//     if (isGuest) {
//       await removeGuestCartItem(product_id_or_itemId);
//     } else {
//       const item = cart.items.find(i => i.product_id === product_id_or_itemId);
//       if (!item) return;
//       await userRemoveItem(cart.id, item.id);
//     }
//     await refreshCart();
//   }

//   async function updateQuantity(product_id, quantity, size = null, color = null) {
//     // User cart not implemented yet, so always use guest update
//     await setGuestCartQuantity(product_id, quantity, size, color);
//     await refreshCart();
//   }

//   useEffect(() => {
//     refreshCart();
//   }, []);

//   const cartItemCount = cart?.items?.length ?? 0;

//   return (
//     <CartContext.Provider value={{ cart, cartItemCount, refreshCart, addItem, removeItem, updateQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);
