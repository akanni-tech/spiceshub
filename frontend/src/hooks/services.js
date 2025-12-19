
import api from "./api";
import { getSessionId } from '../utils/session'

export const getProducts = async () => {
  const response = await api.get("/products/products");
  return response.data;
};

export const getSingleProduct = async ({ params }) => {
  const response = await api.get(`/products/products/${params.productId}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/category/categories");
  return response.data;
};

export const getSingleCategory = async ({ params }) => {
  const response = await api.get(`/category/categories/${params.categoryId}`);
  return response.data;
};



export const quickAddToCart = async (productId, userId, container = "paper") => {
  const session_id = localStorage.getItem("guest_session") || crypto.randomUUID();
  localStorage.setItem("guest_session", session_id);

  const payload = {
    user_id: userId, //default user for now
    items: [{ product_id: productId, quantity: 100, container }]
  }
  const response = await api.post(`/carts/carts`, payload);
  return response.data
}

export async function updateCartItemQuantity(itemId, quantity, container, product_id) {
  const payload = { quantity, container, product_id };
  const { data } = await api.put(`carts/carts/items/${itemId}`, payload);
  return data;
}

export const quickAddToWishlist = async (productId, userId) => {
  const payload = {
    user_id: userId, //default user for now
    items: [{ product_id: productId }]
  }
  const response = await api.post(`/wishlists/wishlists/`, payload);
  return response.data
}

export const addUser = async (payload) => {
  const response = await api.post(`/users/users`, payload);
  return response.data
}

export const getUserBySupabaseId = async (supabaseId) => {
  const response = await api.get(`/users/users/by-supabase/${supabaseId}`);
  return response.data;
}

export const getUserById = async (userId) => {
  const response = await api.get(`/users/users/${userId}`);
  return response.data;
}

export const getUsers = async () => {
  const response = await api.get(`/users/users`);
  return response.data;
}

export const updateUser = async (userId, updateData) => {
  const response = await api.put(`/users/users/${userId}`, updateData);
  return response.data;
}

export const getCartItems = async (user_id) => {
  const response = await api.get(`/carts/carts/user/${user_id}`);
  return response.data;
};

export const getWishlistItems = async (user_id) => {
  const response = await api.get(`/wishlists/wishlists/user/${user_id}`);
  return response.data;
};

export const deleteCartItem = async (cartId, itemId) => {
  return await api.delete(`/carts/carts/${cartId}/items/${itemId}`);
};

export const clearCart = async (cartId) => {
  return await api.delete(`/carts/carts/${cartId}/items`);
};

export const deleteWishlistItem = async (wishlistId, itemId) => {
  return await api.delete(`/wishlists/wishlists/${wishlistId}/items/${itemId}`);
};

export const createOrder = async (orderData) => {
  const response = await api.post(`/orders/orders`, orderData);
  return response.data;
};

export const updateOrder = async (orderId, updateData) => {
  const response = await api.put(`/orders/orders/${orderId}`, updateData);
  return response.data;
};

export const getOrdersByUser = async (userId) => {
  const response = await api.get(`/orders/orders/user/${userId}`);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post(`/reviews/reviews`, reviewData);
  return response.data;
};

export const getReviewsForProduct = async (productId) => {
  const response = await api.get(`/reviews/reviews/product/${productId}`);
  return response.data;
};

export const getCustomers = async () => {
  const response = await api.get("/customers/customers");
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders/orders");
  return response.data;
};

// Guest Cart Services (localStorage based)
export const getGuestCart = () => {
  try {
    const cart = localStorage.getItem('guest_cart');
    return cart ? JSON.parse(cart) : { items: [] };
  } catch (error) {
    console.error('Error reading guest cart from localStorage:', error);
    return { items: [] };
  }
};

export const saveGuestCart = (cart) => {
  try {
    localStorage.setItem('guest_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving guest cart to localStorage:', error);
  }
};

export const addToGuestCart = (product, quantity = 100, size = null, color = null) => {
  const cart = getGuestCart();
  const existingItemIndex = cart.items.findIndex(
    item => item.product_id === product.id &&
      item.size === size &&
      item.color === color
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      id: Date.now() + Math.random(), // temporary ID for localStorage
      product_id: product.id,
      product: product,
      quantity: quantity,
      size: size,
      color: color,
      price: product.price
    });
  }

  saveGuestCart(cart);
  return cart;
};

export const updateGuestCartItem = (itemId, quantity) => {
  const cart = getGuestCart();
  const itemIndex = cart.items.findIndex(item => item.id === itemId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    saveGuestCart(cart);
  }

  return cart;
};

export const removeGuestCartItem = (itemId) => {
  const cart = getGuestCart();
  cart.items = cart.items.filter(item => item.id !== itemId);
  saveGuestCart(cart);
  return cart;
};

export const clearGuestCart = () => {
  localStorage.removeItem('guest_cart');
  return { items: [] };
};


// // AUTH CART (DB)
// export async function getUserCart(user_id) {
//   const res = await api.get(`/carts/carts/user/${user_id}`);
//   return res.data;
// }

// export async function userAddItem(user_id, product_id, quantity = 1, size = null, color = null) {
//   const res = await api.post(`/carts/carts`, {
//     user_id,
//     items: [{ product_id, quantity, size, color }]
//   });
//   return res.data;
// }

// export async function userRemoveItem(cart_id, item_id) {
//   const res = await api.delete(`/carts/carts/${cart_id}/items/${item_id}`);
//   return res.data;
// }


// Guest Wishlist Services (localStorage based)
export const getGuestWishlist = () => {
  try {
    const wishlist = localStorage.getItem('guest_wishlist');
    return wishlist ? JSON.parse(wishlist) : { items: [] };
  } catch (error) {
    console.error('Error reading guest wishlist from localStorage:', error);
    return { items: [] };
  }
};

export const saveGuestWishlist = (wishlist) => {
  try {
    localStorage.setItem('guest_wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error saving guest wishlist to localStorage:', error);
  }
};

export const addToGuestWishlist = (product) => {
  const wishlist = getGuestWishlist();
  const existingItem = wishlist.items.find(item => item.product_id === product.id);

  if (!existingItem) {
    wishlist.items.push({
      id: Date.now() + Math.random(), // temporary ID for localStorage
      product_id: product.id,
      product: product
    });
    saveGuestWishlist(wishlist);
  }

  return wishlist;
};

export const removeGuestWishlistItem = (productId) => {
  const wishlist = getGuestWishlist();
  wishlist.items = wishlist.items.filter(item => item.product_id !== productId);
  saveGuestWishlist(wishlist);
  return wishlist;
};

export const clearGuestWishlist = () => {
  localStorage.removeItem('guest_wishlist');
  return { items: [] };
};

// Merge guest data to user account on login
export const mergeGuestDataToUser = async (userId) => {
  try {
    // Get guest cart and wishlist
    const guestCart = getGuestCart();
    const guestWishlist = getGuestWishlist();

    // Merge cart items
    if (guestCart.items.length > 0) {
      const cartPayload = {
        user_id: userId,
        items: guestCart.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        }))
      };
      await api.post('/carts/carts', cartPayload);
    }

    // Merge wishlist items
    if (guestWishlist.items.length > 0) {
      const wishlistPayload = {
        user_id: userId,
        items: guestWishlist.items.map(item => ({
          product_id: item.product_id
        }))
      };
      await api.post('/wishlists/wishlists/', wishlistPayload);
    }

    // Clear guest data after successful merge
    clearGuestCart();
    clearGuestWishlist();

    return { success: true };
  } catch (error) {
    console.error('Error merging guest data:', error);
    return { success: false, error };
  }
};


// // USER WISHLIST ENDPOINTS

// // export async function getWishlistItems() {
// //   const user = JSON.parse(localStorage.getItem("user") || "null");
// //   if (!user) return { items: [] };
// //   const res = await api.get(`/wishlists/user/${user.id}`);
// //   return res.data;
// // }

// export async function userAddToWishlist(user_id, product_id) {
//   // we must create or update wishlist with the product
//   const res = await api.post(`/wishlists`, {
//     user_id,
//     items: [{ product_id }]
//   });
//   return res.data;
// }

// export async function userRemoveFromWishlist(wishlist_id, item_id) {
//   // Remove just one item
//   const res = await api.delete(`/wishlists/${wishlist_id}/items/${item_id}`);
//   return res.data;
// }






