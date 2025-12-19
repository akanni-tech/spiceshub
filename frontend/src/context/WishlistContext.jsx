import { createContext, useContext, useState, useEffect } from "react";
import {
  getWishlistItems,
  deleteWishlistItem,
  quickAddToWishlist,
  getGuestWishlist,
  addToGuestWishlist,
  removeGuestWishlistItem,
  mergeGuestDataToUser
} from "../hooks/services";
import { useAuth } from "../authResource/useAuth";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ items: [] });
  const { session } = useAuth();
  const isGuest = !session?.user;

  async function refreshWishlist() {
    if (isGuest) {
      const guestWishlist = getGuestWishlist();
      setWishlist(guestWishlist);
    } else {
      try {
        const data = await getWishlistItems(session.user.id);
        setWishlist(data);
      } catch (error) {
        console.error('Error loading user wishlist:', error);
        setWishlist({ items: [] });
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
          // Refresh wishlist to show merged data
          await refreshWishlist();
        }
      };
      mergeData();
    } else {
      // User logged out, refresh to show guest wishlist
      refreshWishlist();
    }
  }, [session?.user]);

  async function addToWishlist(product) {
    if (isGuest) {
      addToGuestWishlist(product);
      await refreshWishlist();
    } else {
      await quickAddToWishlist(product.id, session.user.id);
      await refreshWishlist();
    }
  }

  async function removeFromWishlist(productId) {
    if (isGuest) {
      removeGuestWishlistItem(productId);
      await refreshWishlist();
    } else if (wishlist?.id) {
      // Find the item ID in the wishlist
      const item = wishlist.items.find(item => item.product_id === productId);
      if (item) {
        await deleteWishlistItem(wishlist.id, item.id);
        await refreshWishlist();
      }
    }
  }

  useEffect(() => {
    refreshWishlist();
  }, []);

  const wishlistCount = wishlist?.items?.length;

  const isInWishlist = (productId) => {
    return wishlist?.items?.some(item => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount,
      refreshWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      isGuest
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);