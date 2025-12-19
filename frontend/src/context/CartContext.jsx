import { createContext, useContext, useState, useEffect } from "react";
import { getCartItems, updateCartItemQuantity, clearCart } from "../hooks/services";
import { useAuth } from "../authResource/useAuth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { session } = useAuth()


  async function refreshCart() {
    const user_id = session.user.id
    const data = await getCartItems(user_id);
    setCart(data);
  }

  useEffect(() => {
    refreshCart();
  }, []);

  const updateQuantity = async (itemId, newQty, container, product_id) => {
    try {
      await updateCartItemQuantity(itemId, newQty, container, product_id);
      await refreshCart();
    } catch (err) {
      console.error("Failed to update cart item:", err);
    }
  };

  const clearCartItems = async () => {
    try {
      await clearCart(cart.id);
      await refreshCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const cartItemCount = cart?.items?.length ?? 0;

  return (
    <CartContext.Provider value={{ cart, cartItemCount, refreshCart, updateQuantity, clearCartItems }}>
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
