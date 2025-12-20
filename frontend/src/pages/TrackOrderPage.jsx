import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Truck, Package, MapPin, Phone, Calendar, Download } from 'lucide-react';
import { useAuth } from '../authResource/useAuth';
import { getOrdersByUser, downloadInvoice } from '../hooks/services';
import api from '../hooks/api';
import { Link, useSearchParams } from 'react-router';

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

const Input = ({ placeholder, className, value, onChange, ...props }) => (
    <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A] ${className}`}
        {...props}
    />
);

const Card = ({ children, className }) => (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export function TrackOrderPage() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [orderNumber, setOrderNumber] = useState(orderId || '');
    const [order, setOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { session } = useAuth();

    // Order status progression
    const orderStatuses = [
        { key: 'pending', label: 'Order Placed', icon: CheckCircle, color: 'text-blue-500' },
        { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, color: 'text-blue-500' },
        { key: 'processing', label: 'Processing', icon: Package, color: 'text-yellow-500' },
        { key: 'shipped', label: 'Shipped', icon: Truck, color: 'text-orange-500' },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
    ];

    useEffect(() => {
        if (session?.user?.id) {
            loadUserOrders();
        }
    }, [session]);

    useEffect(() => {
        if (orderId && orders.length > 0) {
            const foundOrder = orders.find(o => o.id === orderId);
            if (foundOrder) {
                setOrder(foundOrder);
                setOrderNumber(orderId);
            }
        }
    }, [orderId, orders]);

    const loadUserOrders = async () => {
        try {
            setLoading(true);
            const userOrders = await getOrdersByUser(session.user.id);
            setOrders(userOrders);
        } catch (err) {
            console.error('Error loading orders:', err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleTrackOrder = async () => {
        if (!orderNumber.trim()) {
            setError('Please enter an order number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // First check if order is already loaded
            const foundOrder = orders.find(o => o.id === orderNumber.trim());
            if (foundOrder) {
                setOrder(foundOrder);
                setLoading(false);
                return;
            }

            // If not found locally, try to fetch it directly
            const response = await api.get(`/orders/orders/${orderNumber.trim()}`);
            setOrder(response.data);
        } catch (err) {
            console.error('Error fetching order:', err);
            setOrder(null);
            setError('Order not found. Please check your order number.');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentStatusIndex = (status) => {
        return orderStatuses.findIndex(s => s.key === status) || 0;
    };

    const generateInvoice = async () => {
        if (!order) return;

        try {
            const invoiceText = await downloadInvoice(order.id);
            const blob = new Blob([invoiceText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${order.id}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Failed to download invoice. Please try again.');
        }
    };

    if (!session) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Track Your Order</h1>
                    <p className="text-gray-600 mb-6">Please log in to track your orders.</p>
                    <Link to="/login">
                        <Button>Log In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#2C2C2C] mb-8">Track Your Order</h1>

            {/* Order Search */}
            <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Enter Order Number</h2>
                <div className="flex gap-4">
                    <Input
                        placeholder="Enter your order ID"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="flex-1"
                    />
                    <Button className="px-2" onClick={handleTrackOrder} disabled={loading}>
                        {loading ? 'Searching...' : 'Track Order'}
                    </Button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </Card>

            {/* Order Details */}
            {order && (
                <div className="space-y-6">
                    {/* Order Header */}
                    <Card className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                                <p className="text-gray-600">
                                    Placed on {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <Badge variant={
                                    order.status === 'delivered' ? 'success' :
                                        order.status === 'shipped' ? 'warning' :
                                            'default'
                                }>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={generateInvoice}
                                    className="ml-2 px-2 mt-2"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Invoice
                                </Button>
                            </div>
                        </div>

                        {/* Order Progress */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-4">Order Progress</h3>
                            <div className="flex items-center justify-between">
                                {orderStatuses.map((status, index) => {
                                    const StatusIcon = status.icon;
                                    const isCompleted = index <= getCurrentStatusIndex(order.status);
                                    const isCurrent = index === getCurrentStatusIndex(order.status);

                                    return (
                                        <div key={status.key} className="flex flex-col items-center flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isCompleted ? 'bg-[#99582A] text-white' : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                <StatusIcon className="w-5 h-5" />
                                            </div>
                                            <p className={`text-sm text-center ${isCurrent ? 'font-semibold text-[#99582A]' : 'text-gray-600'
                                                }`}>
                                                {status.label}
                                            </p>
                                            {index < orderStatuses.length - 1 && (
                                                <div className={`h-1 w-full mt-2 ${index < getCurrentStatusIndex(order.status) ? 'bg-[#99582A]' : 'bg-gray-200'
                                                    }`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>

                    {/* Order Items */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                    <img
                                        src={item.image || '/placeholder-product.jpg'}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity / 100}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">Ksh {(item.price * item.quantity / 100).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Shipping & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                Shipping Address
                            </h3>
                            <div className="space-y-2 text-gray-600">
                                <p>{order.city}, {order.area}</p>
                                {order.address && <p>{order.address}</p>}
                                {order.apartment && <p>{order.apartment}</p>}
                                <p className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {order.phoneNumber}
                                </p>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Method:</span> {order.payOnDelivery ? 'Pay on Delivery' : 'M-Pesa'}</p>
                                {order.mpesaCode && <p><span className="font-medium">M-Pesa Code:</span> {order.mpesaCode}</p>}
                                <p><span className="font-medium">Shipping:</span> {order.shipping_method === 'express' ? 'Express (Ksh 500)' : 'Standard (Free)'}</p>
                                <p className="text-lg font-semibold border-t pt-2">Total: Ksh {order.total_amount.toFixed(2)}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Recent Orders */}
            {orders.length > 0 && !order && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Your Recent Orders</h3>
                    <div className="space-y-4">
                        {orders.slice(0, 5).map((recentOrder) => (
                            <div key={recentOrder.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div>
                                    <p className="font-medium">Order #{recentOrder.id}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(recentOrder.created_at).toLocaleDateString()} •
                                        Ksh {recentOrder.total_amount.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={
                                        recentOrder.status === 'delivered' ? 'success' :
                                            recentOrder.status === 'shipped' ? 'warning' :
                                                'default'
                                    }>
                                        {recentOrder.status.charAt(0).toUpperCase() + recentOrder.status.slice(1)}
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setOrder(recentOrder);
                                            setOrderNumber(recentOrder.id);
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}

export default TrackOrderPage;