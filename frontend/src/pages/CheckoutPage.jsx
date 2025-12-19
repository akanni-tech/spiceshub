import React, { useEffect, useState } from 'react';
import { CreditCard, Lock, Phone, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { deleteCartItem, getCartItems, createOrder, getUserBySupabaseId } from '../hooks/services';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../authResource/useAuth';
import { toast } from 'sonner';

// Mock UI components
const Button = ({ children, className, variant, onClick }) => {
  let baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDA15E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  if (variant === 'outline') {
    baseClasses += ' border border-[#DDA15E] text-[#BC6C25] hover:bg-[#FEFAE0]/70';
  } else {
    baseClasses += ' bg-[#99582A] hover:bg-[#99582A]/90 text-white';
  }

  return (
    <button
      className={`${baseClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Input = ({ placeholder, className, id, type = "text", value, onChange }) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A] ${className}`}
  />
);


const Label = ({ children, htmlFor, className }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
  </label>
);

const RadioGroupItem = ({ value, id, name, selectedValue, onValueChange }) => (
  <input
    type="radio"
    id={id}
    name={name}
    value={value}
    checked={selectedValue === value}
    onChange={() => onValueChange(value)}
    className="w-4 h-4 accent-[#99582A] cursor-pointer focus:ring-[#99582A]"
  />
);


const Checkbox = ({ id, checked, onChange, defaultChecked }) => (
  <input
    id={id}
    type="checkbox"
    checked={checked}
    defaultChecked={defaultChecked}
    onChange={onChange}
    className="w-4 h-4 text-[#99582A] focus:ring-[#99582A] border-gray-300 rounded"
  />
);


export function CheckoutPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const navigate = useNavigate()
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    city: '',
    area: '',
    address: '',
    phone: '',
    apartment: '',
    note: ''
  });
  const [payOnDelivery, setPayOnDelivery] = useState(false);
  const [mpesaCode, setMpesaCode] = useState('');
  const { session } = useAuth();

  const handleRemoveItem = async (itemId) => {
    await removeItem(itemId);
  };

  const { cartItemCount, cart, refreshCart, clearCartItems, addItem, removeItem, isGuest } = useCart()

  // Redirect guests to login when trying to checkout
  useEffect(() => {
    if (isGuest) {
      toast.error("Please log in to proceed with checkout");
      navigate('/login');
      return;
    }
    refreshCart();
  }, [isGuest, cartItemCount])

  const cartItems = cart?.items ?? [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * (item.quantity / 100),
    0
  );
  const shipping = shippingMethod === 'standard' ? 0 : 500;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!session?.user?.id) {
      toast.error("Please log in to place an order");
      return;
    }

    try {
      // Get the database user ID from supabase ID
      const dbUser = await getUserBySupabaseId(session.user.id);

      const orderData = {
        user_id: dbUser.id,
        status: 'pending',
        total_amount: total,
        shipping_method: shippingMethod,
        city: formData.city,
        paid: false,
        area: formData.area,
        address: formData.address,
        phoneNumber: formData.phone,
        apartment: formData.apartment,
        payOnDelivery: payOnDelivery,
        internal_notes: [],
        mpesaCode: mpesaCode || null,
        additionalNote: formData.note,
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          container: item.product.container || null,
          price: item.product.price,
          name: item.product.name || null,
          image: item.product.main_image || null
        }))
      };

      const order = await createOrder(orderData);
      await clearCartItems(); // Clear the cart after successful order
      toast.success("Order placed successfully!");
      navigate('/confirmOrder', { state: { orderNumber: order.id, total: order.total_amount, payment: order.payOnDelivery } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="mb-8 text-[#2C2C2C] text-3xl font-bold">Checkout</h1>

      {/* Progress Indicator */}
      <div className="mb-12 flex items-center justify-center">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= num
                  ? 'bg-[#99582A] text-white'
                  : 'bg-[#F0F0F0] text-gray-600'
                  }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${step > num ? 'bg-[#99582A]' : 'bg-[#F0F0F0]'
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Information */}
          {step === 1 && (
            <div>
              <h2 className="mb-6 text-[#2C2C2C] text-2xl font-semibold">Shipping Information</h2>

              <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
                {/* Contact */}
                {/* <div>
                  <h3 className="mb-4 text-[#2C2C2C] text-lg font-semibold">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="newsletter" />
                      <Label htmlFor="newsletter" className="cursor-pointer">
                        Email me with news and offers
                      </Label>
                    </div>
                  </div>
                </div> */}

                {/* Shipping Address */}
                <div className="">
                  <h3 className="mb-4 text-[#2C2C2C] text-lg font-semibold">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City / County</Label>
                      <Input id="city" placeholder="Nairobi" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="area">Area</Label>
                      <Input id="area" placeholder="Kilimani" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
                    </div>
                    <div className="">
                      <Label htmlFor="address">Address (optional)</Label>
                      <Input id="address" placeholder="123 Sunton" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="(254)7XX XXX XXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                      <Input id="apartment" placeholder="Mumbi house" value={formData.apartment} onChange={(e) => setFormData({ ...formData, apartment: e.target.value })} />
                    </div>
                    <div className='col-span-2 w-full'>
                      <Label htmlFor="note">Additional note</Label>
                      <textarea id="note" className='w-full p-2 border border-gray-200' placeholder="Any special instructions" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="w-full p-3 bg-[#99582A] hover:bg-[#99582A]/90"
                >
                  Continue to Shipping
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Method */}
          {step === 2 && (
            <div>
              <h2 className="mb-6 text-[#2C2C2C] text-2xl font-semibold">Shipping Method</h2>

              <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      id="standard"
                      name="shipping"
                      value="standard"
                      selectedValue={shippingMethod}
                      onValueChange={setShippingMethod}
                    />
                    <Label htmlFor="standard" className='cursor-pointer'>
                      <div>
                        <p className="text-[#2C2C2C]">Standard Shipping</p>
                        <p className="text-sm text-gray-600">within 24 hrs</p>
                      </div>
                    </Label>
                  </div>
                  <span className="text-[#99582A] font-semibold">FREE</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      id="express"
                      name="shipping"
                      value="express"
                      selectedValue={shippingMethod}
                      onValueChange={setShippingMethod}
                    />
                    <Label htmlFor="express">
                      <div>
                        <p className="text-[#2C2C2C]">Express Shipping</p>
                        <p className="text-sm text-gray-600">within 2 hrs</p>
                      </div>
                    </Label>
                  </div>
                  <span className="text-[#99582A] font-semibold">Ksh 500</span>
                </div>


                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 p-3 bg-[#99582A] hover:bg-[#99582A]/90"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div>
              <h2 className="mb-6 text-[#2C2C2C] text-2xl font-semibold">Payment Information</h2>

              <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
                  <div className="flex items-center align-center gap-3">
                    <Checkbox id="payOnDelivery" checked={payOnDelivery} onChange={(e) => setPayOnDelivery(e.target.checked)} />
                    <Label htmlFor="payOnDelivery" className="cursor-pointer">
                      <div>
                        <p className="text-[#2C2C2C] text-lg">Pay on delivery</p>
                      </div>
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">

                  <p>or</p>

                  <div>
                    <Label htmlFor="mpesaCode">Mpesa Message Code</Label>
                    <div className="relative">
                      <Input
                        id="mpesaCode"
                        placeholder="Mpesa code"
                        value={mpesaCode}
                        onChange={(e) => setMpesaCode(e.target.value)}
                        disabled={payOnDelivery}
                      />
                      <button className='p-2 bg-[#99582A] text-white mx-3 rounded-sm'>Submit</button>
                      <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="mb-4 text-[#2C2C2C] font-semibold">Billing Address</h4>
                    <div className="flex items-center gap-2">
                      <Checkbox id="sameBilling" defaultChecked />
                      <Label htmlFor="sameBilling" className="cursor-pointer">
                        Same as shipping address
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="flex-1 p-3 bg-[#99582A] hover:bg-[#99582A]/90"
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="bg-[#F0F0F0] rounded-lg p-6 sticky top-24">
            <h3 className="mb-6 text-[#2C2C2C] text-lg font-semibold">Order Summary</h3>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded bg-white flex-shrink-0">
                    <img
                      src={item.product.main_image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#2C2C2C] truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm text-[#2C2C2C]">
                    ksh {(item.product.price * (item.quantity / 100)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipping Method */}
            <div className="mb-4 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping Method</span>
                <span className="text-[#2C2C2C] capitalize">{shippingMethod}</span>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-[#2C2C2C]">ksh {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-[#2C2C2C]">
                  {shipping === 0 ? 'FREE' : `ksh ${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-[#2C2C2C]">ksh 0</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-[#2C2C2C] font-semibold">Total</span>
                <span className="text-[#99582A] font-semibold">ksh {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;