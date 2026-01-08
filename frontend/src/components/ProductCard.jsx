import React, { useState } from 'react';
import { ShoppingCart, Heart, Maximize, X, Star, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { quickAddToCart, quickAddToWishlist } from '../hooks/services';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';
import { useAuth } from '../authResource/useAuth';


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

export function ProductCard({ product, onProductClick, onAddToCart }) {
  const { refreshCart, addItem, isGuest } = useCart();
  const { session } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0);
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = async () => {
    if (isGuest) {
      addItem(product, 100); // Default quantity 100 (grams)
      toast.success("Added to cart");
    } else {
      await addItem(product, 100);
      toast.success("Added to cart");
    }
  };

  const handleToggleWishlist = async () => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      await addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const handleMaximize = () => {
    setShowModal(true);
  };


  return (
    <div className="group cursor-pointer">
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

        {/* Badges (New/Sale) */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            // New Badge: Uses Primary Accent Color for distinction
            <Badge className="bg-[#BC6C25] text-[#FEFAE0] font-bold shadow-sm">
              New
            </Badge>
          )}
          {product.isSale && (
            // Sale Badge: Uses a distinct color (Red) for urgency
            <Badge className="bg-red-600 text-white font-bold shadow-sm">
              Sale
            </Badge>
          )}
        </div>

        {/* Quick Actions (Heart) - Appears on Hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-x-0">
          <Button
            onClick={handleToggleWishlist}
            size="icon"
            // Heart Button: Using light background with Primary Accent text for elegance
            className="w-9 h-9 bg-[#FEFAE0] hover:bg-[#DDA15E] text-[#BC6C25] shadow-lg rounded-full transition-all duration-200 "
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </Button>
          <Button
            onClick={handleMaximize}
            size="icon"
            className="w-9 h-9 bg-[#FEFAE0] hover:bg-[#DDA15E] text-[#BC6C25] shadow-lg rounded-full transition-all duration-200 hover:scale-110"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>

        {/* Add to Cart - Main Dopamine Inducing CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <Button
            onClick={handleAddToCart}
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
        <div onClick={() => onProductClick(product.id)} className="p-1">
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
                  className={`text-base ${i < Math.floor(product.rating) ? 'text-[#DDA15E]' : 'text-gray-300' // Using Secondary Accent for ratings
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
              Ksh {(product.salePrice || product.price)?.toFixed(2) || '0.00'}
            </span>
            {(product.originalPrice || (product.salePrice && product.price !== product.salePrice)) && (
              <span className="text-sm text-gray-500 line-through opacity-75">
                Ksh {(product.originalPrice || product.price)?.toFixed(2) || '0.00'}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Product Quick View Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-[#2C2C2C]">Quick View</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div>
                  <div className="mb-4 rounded-lg overflow-hidden bg-[#F0F0F0] aspect-square">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.images && product.images.map((img, idx) => (
                      <button key={idx} onClick={() => setSelectedImage(idx)}
                        className={`rounded-lg overflow-hidden aspect-square ${selectedImage === idx ? 'ring-2 ring-[#99582A]' : ''}`}>
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4 ">
                  {/* Product Name */}
                  <h3 className="text-2xl font-bold text-[#2C2C2C]">{product.name}</h3>

                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                      {product.category?.name || 'Category'}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
                            ? 'text-[#DDA15E] fill-current'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#BC6C25]">
                      Ksh {(product.salePrice || product.price)?.toFixed(2) || '0.00'}
                    </span>
                    {(product.originalPrice || (product.salePrice && product.price !== product.salePrice)) && (
                      <span className="text-lg text-gray-500 line-through">
                        Ksh {(product.originalPrice || product.price)?.toFixed(2) || '0.00'}
                      </span>
                    )}
                  </div>

                  {/* Short Description */}
                  <div>
                    <h4 className="font-semibold text-[#2C2C2C] mb-2">Description</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.short_description || 'No description available.'}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2">
                    {product.isNew && (
                      <Badge className="bg-[#BC6C25] text-[#FEFAE0] font-bold">
                        New
                      </Badge>
                    )}
                    {product.isSale && (
                      <Badge className="bg-red-600 text-white font-bold">
                        Sale
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        handleAddToCart();
                        setShowModal(false);
                      }}
                      className="flex-1 bg-[#BC6C25] hover:bg-[#DDA15E] text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link to={`/product/${product.id}`} className="flex-1">
                      <Button
                        onClick={() => setShowModal(false)}
                        className="w-full border border-[#BC6C25] text-[#BC6C25] hover:bg-[#FEFAE0]"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}