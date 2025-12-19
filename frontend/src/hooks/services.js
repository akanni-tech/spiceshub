
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

export const getCustomers = async () => {
  const response = await api.get("/customers/customers");
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders/orders");
  return response.data;
};

// // guest endpoints
// export async function getGuestCart() {
//   const session_id = getSessionId();
//   const res = await api.get(`/guest/guest-cart/${session_id}`);
//   return res.data;
// }

// export async function addToGuestCart(product_id, quantity = 1, size = null, color = null) {
//   const session_id = getSessionId();
//   const res = await api.post(`/guest/guest-cart/guest/add`, {
//     session_id,
//     items: [{ product_id, quantity, size, color }]
//   });
//   return res.data;
// }

// export async function removeGuestCartItem(product_id) {
//   const session_id = getSessionId();
//   const res = await api.delete(`/guest/guest-cart/${session_id}/items/${product_id}`);
//   return res.data;
// }

// export async function setGuestCartQuantity(product_id, quantity, size = null, color = null) {
//   const session_id = getSessionId();
//   const res = await api.patch(`/guest/guest-cart/quantity`, {
//     session_id,
//     product_id,
//     quantity,
//     size,
//     color
//   });
//   return res.data;
// }


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


// // GUEST WISHLIST ENDPOINTS

// export async function getGuestWishlist() {
//   const session_id = getSessionId();
//   const res = await api.get(`/guest/guest-wishlist/${session_id}`);
//   return res.data;
// }

// export async function addToGuestWishlist(product_id) {
//   const session_id = getSessionId();
//   const res = await api.post(`/guest/guest-wishlist/${session_id}/add/${product_id}`);
//   return res.data;
// }

// export async function removeGuestWishlistItem(product_id) {
//   const session_id = getSessionId();
//   const res = await api.delete(`/guest/guest-wishlist/${session_id}/items/${product_id}`);
//   return res.data;
// }

// export async function clearGuestWishlist() {
//   const session_id = getSessionId();
//   await api.delete(`/guest/guest-wishlist/${session_id}/clear`);
// }

// //MERGE FOR WISHLIST
// export async function onLoginSuccess(user) {
//   const session_id = getSessionId();
//   await api.post(`/guest/guest-wishlist/merge/${session_id}/${user.id}`);

//   // Then refresh local wishlist context
//   refreshWishlist();
// }


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






