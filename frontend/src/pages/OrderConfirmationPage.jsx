import React, { useEffect } from 'react';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useLocation } from 'react-router';

function OrderConfirmationPage() {
  const {cartItemCount, cart, refreshCart} = useCart()
  const {state} = useLocation()
  const {orderNumber, total, payment} = state || {};
  
  useEffect(() => {
    refreshCart()
  }, [cartItemCount])

  const cartItems = cart?.items ?? [];

  // const total = cartItems.reduce(
  //   (sum, item) => sum + item.product.price * (item.quantity / 100),
  //   0
  // );

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="mb-2 text-[#2C2C2C]">Thank You for Your Order!</h1>
        <p className="text-muted-foreground">
          Your order has been successfully placed and is being processed.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-[#FFE6A7] rounded-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
            <p className="text-[#2C2C2C]">{orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Order Date</p>
            <p className="text-[#2C2C2C]">November 5, 2025</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-[#99582A]">ksh {total}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
            <p className="text-[#2C2C2C]">{payment ? "pay on delivery" : "Mpesa"}</p>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="mb-8">
        <h3 className="mb-6 text-[#2C2C2C]">What's Next?</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#99582A] flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="mb-1 text-[#2C2C2C]">Order Confirmation Email</h4>
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation email to your inbox with order details.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFE6A7] flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-[#99582A]" />
            </div>
            <div>
              <h4 className="mb-1 text-[#2C2C2C]">Processing Your Order</h4>
              <p className="text-sm text-muted-foreground">
                We're preparing your items for shipment. This usually takes 1-2 business days.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-[#99582A]" />
            </div>
            <div>
              <h4 className="mb-1 text-[#2C2C2C]">Shipping & Delivery</h4>
              <p className="text-sm text-muted-foreground">
                Your order will be shipped soon. Estimated delivery: 5-7 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h3 className="mb-4 text-[#2C2C2C]">Order Items</h3>
        <div className="bg-white rounded-lg border border-gray-200 divide-y">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4">
              <div className="w-20 h-20 rounded bg-[#F0F0F0] flex-shrink-0">
                <img
                  src={item.product.main_image}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h4 className="mb-1 text-[#2C2C2C]">{item.product.name}</h4>
                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-[#2C2C2C]">ksh {(item.product.price * (item.quantity / 100)).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onNavigate('account')}
          className="flex-1 px-4 py-2 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90"
        >
          Track Your Order
        </button>
        <Link to={"/products"}>
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 px-4 py-2 border border-[#99582A] text-[#99582A] rounded hover:bg-[#FFE6A7]"
          >
            Continue Shopping
          </button>
        </Link>
      </div>

      {/* Help Section */}
      <div className="mt-12 text-center p-6 bg-[#F0F0F0] rounded-lg">
        <h4 className="mb-2 text-[#2C2C2C]">Need Help?</h4>
        <p className="text-sm text-muted-foreground mb-4">
          If you have any questions about your order, our customer service team is here to help.
        </p>
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Contact Support</button>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;