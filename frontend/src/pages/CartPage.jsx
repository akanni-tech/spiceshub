import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { deleteCartItem, getCartItems } from '../hooks/services';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router';
import CartPageSkeleton from '../components/CartPageSkeleton';
import { useAuth } from '../authResource/useAuth';

// --- CORE UI COMPONENTS & HELPERS (from CategoryPage.jsx) ---

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Button = ({ children, className = '', variant, size, onClick, disabled, ...props }) => {
  let baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDA15E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  if (size === 'icon') {
    baseClasses += ' w-9 h-9 p-0';
  } else {
    baseClasses += ' h-10 px-4 py-2';
  }

  if (variant === 'outline') {
    baseClasses += ' border border-[#DDA15E] text-[#BC6C25] hover:bg-[#FEFAE0]/70';
  } else if (variant === 'ghost') {
    // Added ghost variant logic from your CartPage code
    baseClasses += ' hover:bg-gray-100 data-[destructive]:hover:bg-red-100 data-[destructive]:text-red-600';
  } else if (className.includes('bg-[#BC6C25]') || className.includes('bg-[#99582A]')) {
    // Primary style defined via className
  } else {
    baseClasses += ' bg-gray-200 text-gray-800 hover:bg-gray-300';
  }

  // Handle destructive prop for ghost variant
  if (props['data-destructive']) {
      baseClasses += ' text-red-600 hover:bg-red-100';
  }


  return (
    <button
      className={cn(baseClasses, className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const ImageWithFallback = ({ src, alt, className = '', onClick }) => (
  <img 
    src={src} 
    alt={alt} 
    className={className} 
    onClick={onClick} 
    onError={(e) => e.target.src = "https://placehold.co/400x533/f0f0f0/333?text=Image+Error"}
    loading="lazy"
  />
);


export function CartPage({ onUpdateQuantity, onRemoveItem, onNavigate }) {
  const { refreshCart, cart, cartItemCount, updateQuantity } = useCart();
  const [loading, setLoading] = useState(true);
  const {session} = useAuth()

  const removeItem = async (itemId) => {
    const cartId = cart.id
    await deleteCartItem(cartId, itemId)
    await refreshCart();
  };
  
  useEffect(() => {
    async function loadCart() {
      setLoading(true);
      await refreshCart();
      setLoading(false);
    }
    loadCart();
  }, [cartItemCount])

  const cartItems = cart?.items ?? [];

  

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * (item.quantity / 100),
    0
  );
  
  const shipping = subtotal > 500 ? 0 : 200;
  const total = subtotal + shipping;
  console.log(cartItems)

  if (loading) return <CartPageSkeleton />;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 font-sans">
        <div className="text-center py-16 bg-[#FEFAE0]/50 rounded-lg">
          <h2 className="text-3xl font-serif font-bold mb-4 text-[#BC6C25]">Your Cart is Empty</h2>
          <p className="mb-8 text-gray-500">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to={"/products"}>
            <Button
              className="bg-[#BC6C25] hover:bg-[#DDA15E] text-white font-bold"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-4xl font-serif font-extrabold text-[#BC6C25] mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-white rounded-lg border border-[#DDA15E]/50 shadow-sm"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded bg-[#FEFAE0] flex-shrink-0 overflow-hidden border border-[#DDA15E]/20">
                  <ImageWithFallback
                    src={item.product.main_image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-serif font-medium text-gray-800">{item.product.name}</h3>
                    <p className="text-lg font-bold text-[#BC6C25] mb-3">
                      ksh {(item.product.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-[#DDA15E] text-[#BC6C25]"

                      onClick={() => updateQuantity(item.id, Math.max(100, item.quantity - 100), item.container, item.product_id)}


                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-bold text-lg text-gray-700">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-[#DDA15E] text-[#BC6C25]"
                      onClick={() => updateQuantity(item.id, item.quantity + 100, item.container, item.product_id)}


                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    data-destructive // Pass data-destructive for styling
                    onClick={() => {
                      removeItem(item.id)
                    }}
                    className="text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <p className="text-lg font-bold text-gray-800">
                    ksh {((item.product.price * (item.quantity/ 100))).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className='mt-2 text-sm text-gray-500'>The price and availability of items are subject to change.</p>

          <Link to={"/products"}>
            <Button
              variant="ghost"
              className="mt-3 text-[#BC6C25] hover:text-[#BC6C25] hover:bg-[#FEFAE0] font-bold"
            >
              ← Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-[#FEFAE0] rounded-lg p-6 sticky top-24 border border-[#DDA15E]/50">
            <h3 className="text-2xl font-serif font-bold mb-6 text-[#2C2C2C]">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">ksh {(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-medium">{shipping === 0 ? 'FREE' : `ksh ${(shipping).toFixed(2)}`}</span>
              </div>
              
              {/* Shipping message */}
              {shipping === 0 && (
                <p className="text-sm text-[#BC6C25] font-medium">
                  You've qualified for free shipping!
                </p>
              )}
              {shipping > 0 && (
                <p className="text-sm text-gray-500">
                  Add ksh {((5000 - subtotal)).toFixed(2)} more for free shipping
                </p>
              )}

              <div className="pt-4 border-t border-[#DDA15E]/30">
                <div className="flex justify-between text-xl font-bold text-[#2C2C2C]">
                  <span>Total</span>
                  <span>ksh {(total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link to={"/checkout"}>
              <Button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-[#BC6C25] hover:bg-[#DDA15E] text-white font-bold text-base"
              >
                Proceed to Checkout
              </Button>
            </Link>

            <div className="text-center text-xs text-gray-500 mt-4">
              Taxes calculated at checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;