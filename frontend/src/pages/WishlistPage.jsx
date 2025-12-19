import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Trash2, Share2, Maximize, Delete } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { deleteWishlistItem, getWishlistItems, quickAddToCart } from '../hooks/services';
import { Link } from 'react-router';
import { useCart } from '../context/CartContext';

const Button = ({ children, className = '', size, onClick, ...props }) => {
  let baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  if (size === 'icon') {
    baseClasses += ' w-9 h-9';
  } else {
    baseClasses += ' h-10 px-4 py-2';
  }

  return (
    <button
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};


const Badge = ({ children, className = '', ...props }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}
    {...props}
  >
    {children}
  </span>
);

function WishlistPage({
  onNavigate,
  onAddToCart,
  onRemoveFromWishlist
}) {
  const handleAddAllToCart = () => {
    wishlistItems.forEach(product => onAddToCart(product));
  };

  const { refreshWishlist, wishlist, wishlistCount } = useWishlist();
  
  const removeWishlistItem = async (itemId) => {
    const wishlistId = wishlist.id
    await deleteWishlistItem(wishlistId, itemId)
    await refreshWishlist();
  };

  console.log(wishlistCount)
  
  useEffect(() => {
    refreshWishlist()
  }, [wishlistCount])

  const wishlistItems = wishlist?.items ?? [];


  const {refreshCart} = useCart();
  
  const handleAddToCart = async (id) => {
    await quickAddToCart(id);
    await refreshCart(); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => onNavigate('home')} className="hover:text-[#99582A]">
          Home
        </button>
        <span>/</span>
        <span className="text-[#2C2C2C]">Wishlist</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="mb-2 text-[#2C2C2C]">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex gap-3">
            {/* <button
              className="px-4 py-2 border border-[#99582A] text-[#99582A] rounded hover:bg-[#FFE6A7] flex items-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Wishlist
            </button>
            <button
              onClick={handleAddAllToCart}
              className="px-4 py-2 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90 flex items-center"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add All to Cart
            </button> */}
          </div>
        )}
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <>
          {/* Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {wishlistItems.map((item) => {
              const product = item.product;

              return(
              <div key={product.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3 bg-[#FEFAE0] border border-[#BC6C25]/20 shadow-md transition-shadow duration-300 group-hover:shadow-xl">
                  
                  {/* Product Image */}
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.main_image}
                      alt={product.name}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>
                

                  {/* Quick Actions (Heart) - Appears on Hover */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-x-0">
                    <Button
                      onClick={() => removeWishlistItem(item.id)}
                      size="icon"
                      // Heart Button: Using light background with Primary Accent text for elegance
                      className="w-9 h-9 bg-[#FEFAE0] hover:bg-[#DDA15E] text-[#BC6C25] shadow-lg rounded-full transition-all duration-200 "
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="w-9 h-9 bg-[#FEFAE0] hover:bg-[#DDA15E] text-[#BC6C25] shadow-lg rounded-full transition-all duration-200 hover:scale-110"
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Add to Cart - Main Dopamine Inducing CTA */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    <Button
                      onClick={() => {
                        handleAddToCart(product.id)            
                      }}
                      // CTA Button: Primary Accent Color for high conversion
                      className="w-full bg-[#BC6C25] hover:bg-[#DDA15E] text-[#FEFAE0] font-bold tracking-wider shadow-xl transition-all duration-200 hover:scale-[1.02]"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Quick Add
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <Link to={`/product/${product.id}`}>
                  <div className="p-1">
                    <div className="flex items-center gap-2">
                      <span className='text-sm text-gray-500' >{product.category.name}</span>
                    </div>
                    <h3 className="mb-1 text-lg text-gray-800 font-serif font-medium line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-base ${
                              i < Math.floor(product.rating) ? 'text-[#DDA15E]' : 'text-gray-300' // Using Secondary Accent for ratings
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-[#BC6C25]">
                        Ksh {product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through opacity-75">
                          {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>)
            })}
          </div>

          {/* Info Banner */}
          <div className="bg-[#FFE6A7] rounded-lg p-6 mt-8">
            <div className="flex items-start gap-4">
              <Heart className="w-6 h-6 text-[#99582A] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-[#2C2C2C] mb-2">Price Drop Alerts</h3>
                <p className="text-[#2C2C2C]/80 text-sm">
                  We'll notify you when items in your wishlist go on sale. Make sure notifications
                  are enabled in your profile settings.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#FFE6A7] rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-[#99582A]" />
          </div>
          <h2 className="mb-3 text-[#2C2C2C]">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start adding items you love to your wishlist. You can save them for later or share
            your favorites with friends and family.
          </p>
          <button
            onClick={() => onNavigate('category')}
            className="px-6 py-3 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* Recommendations */}
      {wishlistItems.length > 0 && (
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="mb-8 text-[#2C2C2C]">You Might Also Like</h2>
          <div className="text-center py-8 text-muted-foreground">
            Personalized recommendations would appear here
          </div>
        </div>
      )}
    </div>
  );
}

export default WishlistPage;