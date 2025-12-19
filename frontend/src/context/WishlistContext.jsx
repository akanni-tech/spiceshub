import { createContext, useContext, useState, useEffect } from "react";
import { getWishlistItems, deleteWishlistItem, quickAddToWishlist } from "../hooks/services";
import { useAuth } from "../authResource/useAuth";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { session } = useAuth();

  async function refreshWishlist() {
    if (session?.user?.id) {
      const data = await getWishlistItems(session.user.id);
      setWishlist(data);
    }
  }

  async function addToWishlist(productId) {
    if (session?.user?.id) {
      await quickAddToWishlist(productId, session.user.id);
      await refreshWishlist();
    }
  }

  async function removeFromWishlist(itemId) {
    if (wishlist?.id) {
      await deleteWishlistItem(wishlist.id, itemId);
      await refreshWishlist();
    }
  }

  useEffect(() => {
    refreshWishlist();
  }, [session?.user?.id]);

  const wishlistCount = wishlist?.items?.length;

  const isInWishlist = (productId) => {
    return wishlist?.items?.some(item => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistCount, refreshWishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);