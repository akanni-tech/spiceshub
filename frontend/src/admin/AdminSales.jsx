import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, Percent, Clock, Play, Pause } from 'lucide-react';
import { getSales, getProducts, createSale, updateSale, deleteSale } from '../hooks/services';
import { toast } from 'sonner';

const Button = ({ children, className, variant, onClick, disabled }) => {
    let baseClasses = 'inline-flex p-2 items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDA15E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    if (variant === 'outline') {
        baseClasses += ' border border-[#DDA15E] text-[#BC6C25] hover:bg-[#FEFAE0]/70';
    } else if (variant === 'destructive') {
        baseClasses += ' bg-red-600 hover:bg-red-700 text-white';
    } else {
        baseClasses += ' bg-[#99582A] hover:bg-[#99582A]/90 text-white';
    }

    return (
        <button
            className={`${baseClasses} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const Input = ({ className, ...props }) => (
    <input
        className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A] ${className}`}
        {...props}
    />
);

const Label = ({ children, className }) => (
    <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
        {children}
    </label>
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

export function AdminSales() {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        discount_percentage: 0,
        start_date: '',
        end_date: '',
        is_active: false,
        banner_image: '',
        banner_text: '',
        products: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            // Load sales
            try {
                const salesData = await getSales();
                setSales(salesData);
            } catch (error) {
                console.error('Error loading sales data:', error);
                setSales([]);
            }
            // Load products
            try {
                const productsData = await getProducts();
                setProducts(productsData);
            } catch (error) {
                console.error('Error loading products data:', error);
                setProducts([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSale) {
                await updateSale(editingSale.id, formData);
            } else {
                await createSale(formData);
            }
            setShowModal(false);
            resetForm();
            loadData();
        } catch (error) {
            console.error('Error saving sale:', error);
            toast.error('Failed to save sale. Please try again.');
        }
    };

    const handleEdit = (sale) => {
        setEditingSale(sale);
        setFormData({
            name: sale.name,
            description: sale.description || '',
            discount_percentage: sale.discount_percentage,
            start_date: new Date(sale.start_date).toISOString().slice(0, 16),
            end_date: new Date(sale.end_date).toISOString().slice(0, 16),
            is_active: sale.is_active,
            banner_image: sale.banner_image || '',
            banner_text: sale.banner_text || '',
            products: sale.products.map(sp => ({
                product_id: sp.product_id,
                discounted_price: sp.discounted_price
            }))
        });
        setShowModal(true);
    };

    const handleDelete = async (saleId) => {
        if (!confirm('Are you sure you want to delete this sale?')) return;

        try {
            await deleteSale(saleId);
            loadData();
        } catch (error) {
            console.error('Error deleting sale:', error);
            toast.error('Failed to delete sale. Please try again.');
        }
    };

    const handleToggleActive = async (sale) => {
        try {
            await updateSale(sale.id, { is_active: !sale.is_active });
            loadData();
        } catch (error) {
            console.error('Error toggling sale status:', error);
            toast.error('Failed to update sale status. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            discount_percentage: 0,
            start_date: '',
            end_date: '',
            is_active: false,
            banner_image: '',
            banner_text: '',
            products: []
        });
        setEditingSale(null);
    };

    const addProductToSale = () => {
        setFormData(prev => ({
            ...prev,
            products: [...prev.products, { product_id: '', discounted_price: 0 }]
        }));
    };

    const removeProductFromSale = (index) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }));
    };

    const updateProductInSale = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map((product, i) =>
                i === index ? { ...product, [field]: value } : product
            )
        }));
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#2C2C2C]">Sales Management</h1>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Sale
                </Button>
            </div>

            {/* Sales List */}
            <div className="space-y-4">
                {sales.map((sale) => (
                    <Card key={sale.id} className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-[#2C2C2C]">{sale.name}</h3>
                                    <Badge variant={sale.is_active ? 'success' : 'default'}>
                                        {sale.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <p className="text-gray-600 mb-3">{sale.description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Discount:</span>
                                        <span className="ml-2 text-[#99582A]">{sale.discount_percentage}%</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Products:</span>
                                        <span className="ml-2">{sale.products?.length || 0}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Start:</span>
                                        <span className="ml-2">{new Date(sale.start_date).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">End:</span>
                                        <span className="ml-2">{new Date(sale.end_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleActive(sale)}
                                >
                                    {sale.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(sale)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(sale.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[#2C2C2C]">
                                    {editingSale ? 'Edit Sale' : 'Create Sale'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Discount Percentage</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.discount_percentage}
                                            onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseFloat(e.target.value) }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Description</Label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A]"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Start Date</Label>
                                        <Input
                                            type="datetime-local"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>End Date</Label>
                                        <Input
                                            type="datetime-local"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Banner Image URL</Label>
                                        <Input
                                            type="url"
                                            value={formData.banner_image}
                                            onChange={(e) => setFormData(prev => ({ ...prev, banner_image: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Banner Text</Label>
                                        <Input
                                            type="text"
                                            value={formData.banner_text}
                                            onChange={(e) => setFormData(prev => ({ ...prev, banner_text: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                        className="rounded border-gray-300 text-[#99582A] focus:ring-[#99582A]"
                                    />
                                    <Label htmlFor="is_active" className="mb-0">Active Sale</Label>
                                </div>

                                {/* Products Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <Label>Products in Sale</Label>
                                        <Button type="button" variant="outline" onClick={addProductToSale}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Product
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {formData.products.map((product, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded">
                                                <select
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A]"
                                                    value={product.product_id}
                                                    onChange={(e) => updateProductInSale(index, 'product_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Product</option>
                                                    {products.map((prod) => (
                                                        <option key={prod.id} value={prod.id}>
                                                            {prod.name} - Ksh {prod.price}
                                                        </option>
                                                    ))}
                                                </select>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Discounted Price"
                                                    value={product.discounted_price}
                                                    onChange={(e) => updateProductInSale(index, 'discounted_price', parseFloat(e.target.value))}
                                                    className="w-32"
                                                    required
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeProductFromSale(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingSale ? 'Update Sale' : 'Create Sale'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default AdminSales;