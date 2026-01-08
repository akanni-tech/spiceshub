import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Heart, Eye, EyeOff, X, Search } from 'lucide-react';
import { getHealthCategories, getProducts, createHealthCategory, updateHealthCategory, deleteHealthCategory } from '../hooks/services';

// Mock UI components
const Button = ({ children, className, variant, onClick, disabled }) => {
    let baseClasses = 'inline-flex p-2 items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDA15E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    if (variant === 'outline') {
        baseClasses += ' border border-[#DDA15E] text-[#BC6C25] hover:bg-[#FEFAE0]/70';
    } else if (variant === 'secondary') {
        baseClasses += ' bg-[#FFE6A7] text-[#99582A] hover:bg-[#FFE6A7]/80';
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

const Input = ({ placeholder, className, value, onChange, ...props }) => (
    <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A] ${className}`}
        {...props}
    />
);

const Textarea = ({ placeholder, className, value, onChange, ...props }) => (
    <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A] ${className}`}
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
        primary: 'bg-[#99582A] text-white',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

const AdminHealth = () => {
    const [healthCategories, setHealthCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showProductSearch, setShowProductSearch] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '',
        benefits: '',
        usage: '',
        safety_notes: '',
        is_active: true,
        recommendations: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [categoriesData, productsData] = await Promise.all([
                getHealthCategories(),
                getProducts()
            ]);
            setHealthCategories(categoriesData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadHealthCategories = async () => {
        try {
            const data = await getHealthCategories();
            setHealthCategories(data);
        } catch (error) {
            console.error('Error loading health categories:', error);
        }
    };

    const handleAddCategory = () => {
        setFormData({
            name: '',
            description: '',
            icon: '',
            benefits: '',
            usage: '',
            safety_notes: '',
            is_active: true,
            recommendations: []
        });
        setEditingCategory(null);
        setShowAddModal(true);
    };

    const handleEditCategory = (category) => {
        setFormData({
            name: category.name,
            description: category.description,
            icon: category.icon,
            benefits: category.benefits,
            usage: category.usage,
            safety_notes: category.safety_notes,
            is_active: category.is_active,
            recommendations: category.recommendations || []
        });
        setEditingCategory(category);
        setShowAddModal(true);
    };

    const handleAddProductToRecommendations = (product) => {
        const existingRec = formData.recommendations.find(rec => rec.product_id === product.id);
        if (existingRec) {
            // Update quantity if already exists
            setFormData({
                ...formData,
                recommendations: formData.recommendations.map(rec =>
                    rec.product_id === product.id
                        ? { ...rec, quantity: rec.quantity + 1 }
                        : rec
                )
            });
        } else {
            // Add new recommendation
            setFormData({
                ...formData,
                recommendations: [...formData.recommendations, {
                    product_id: product.id,
                    product_name: product.name,
                    quantity: 1,
                    unit: 'tsp daily',
                    frequency: 'daily'
                }]
            });
        }
        setShowProductSearch(false);
        setProductSearch('');
    };

    const handleRemoveProductFromRecommendations = (productId) => {
        setFormData({
            ...formData,
            recommendations: formData.recommendations.filter(rec => rec.product_id !== productId)
        });
    };

    const handleUpdateRecommendationQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            handleRemoveProductFromRecommendations(productId);
            return;
        }
        setFormData({
            ...formData,
            recommendations: formData.recommendations.map(rec =>
                rec.product_id === productId
                    ? { ...rec, quantity: parseFloat(quantity) }
                    : rec
            )
        });
    };

    const handleUpdateRecommendationUnit = (productId, unit) => {
        setFormData({
            ...formData,
            recommendations: formData.recommendations.map(rec =>
                rec.product_id === productId
                    ? { ...rec, unit }
                    : rec
            )
        });
    };

    const handleUpdateRecommendationFrequency = (productId, frequency) => {
        setFormData({
            ...formData,
            recommendations: formData.recommendations.map(rec =>
                rec.product_id === productId
                    ? { ...rec, frequency }
                    : rec
            )
        });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
    );

    const handleSaveCategory = async () => {
        try {
            if (editingCategory) {
                await updateHealthCategory(editingCategory.id, formData);
            } else {
                await createHealthCategory(formData);
            }
            setShowAddModal(false);
            loadHealthCategories(); // Refresh the list
        } catch (error) {
            console.error('Error saving health category:', error);
            alert('Failed to save health category. Please try again.');
        }
    };

    const handleToggleActive = async (category) => {
        try {
            await updateHealthCategory(category.id, { ...category, is_active: !category.is_active });
            loadHealthCategories(); // Refresh the list
        } catch (error) {
            console.error('Error toggling health category status:', error);
            alert('Failed to update health category status. Please try again.');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!confirm('Are you sure you want to delete this health category?')) return;

        try {
            await deleteHealthCategory(categoryId);
            loadHealthCategories(); // Refresh the list
        } catch (error) {
            console.error('Error deleting health category:', error);
            alert('Failed to delete health category. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#2C2C2C]">Health & Wellness Management</h1>
                    <p className="text-gray-600">Create and manage health categories with recommended spice bundles</p>
                </div>
                <Button onClick={handleAddCategory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Health Category
                </Button>
            </div>

            {/* Health Categories Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="p-6">
                            <div className="animate-pulse">
                                <div className="text-4xl mb-4 bg-gray-200 rounded h-12"></div>
                                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {healthCategories.map((category) => (
                        <Card key={category.id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="text-4xl mb-4">{category.icon || '🌿'}</div>

                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-[#2C2C2C]">{category.name}</h3>
                                <Badge variant={category.is_active ? 'success' : 'default'}>
                                    {category.is_active ? 'Active' : 'Draft'}
                                </Badge>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>

                            <div className="mb-4">
                                <p className="text-sm text-gray-700 line-clamp-2">{category.benefits}</p>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500">{category.recommendations?.length || 0} products</span>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditCategory(category)}
                                    className="flex-1"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleActive(category)}
                                    className="px-2"
                                >
                                    {category.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="px-2 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#2C2C2C]">
                                    {editingCategory ? 'Edit Health Category' : 'Add New Health Category'}
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                        <Input
                                            placeholder="e.g., Immunity Boost"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                        <Input
                                            placeholder="e.g., 🛡️"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <Textarea
                                        placeholder="Brief description of the health category"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Traditional Benefits</label>
                                    <Textarea
                                        placeholder="Describe the traditional benefits (non-medical language)"
                                        value={formData.benefits}
                                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Instructions</label>
                                    <Textarea
                                        placeholder="How to use the recommended spices"
                                        value={formData.usage}
                                        onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Safety Notes</label>
                                    <Textarea
                                        placeholder="Important safety information and disclaimers"
                                        value={formData.safety_notes}
                                        onChange={(e) => setFormData({ ...formData, safety_notes: e.target.value })}
                                        rows={2}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded border-gray-300"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                        Active (visible to customers)
                                    </label>
                                </div>

                                {/* Recommendations Section */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Recommended Products</h3>
                                        <Button
                                            onClick={() => setShowProductSearch(true)}
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Product
                                        </Button>
                                    </div>

                                    {formData.recommendations.length === 0 ? (
                                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                                            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">No products recommended yet</p>
                                            <p className="text-sm text-gray-400">Click "Add Product" to start building recommendations</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {formData.recommendations.map((rec) => (
                                                <div key={rec.product_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{rec.product_name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            value={rec.quantity}
                                                            onChange={(e) => handleUpdateRecommendationQuantity(rec.product_id, e.target.value)}
                                                            className="w-20 text-sm"
                                                            min="0.1"
                                                            step="0.1"
                                                        />
                                                        <Input
                                                            value={rec.unit}
                                                            onChange={(e) => handleUpdateRecommendationUnit(rec.product_id, e.target.value)}
                                                            className="w-24 text-sm"
                                                            placeholder="unit"
                                                        />
                                                        <select
                                                            value={rec.frequency}
                                                            onChange={(e) => handleUpdateRecommendationFrequency(rec.product_id, e.target.value)}
                                                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                        >
                                                            <option value="daily">daily</option>
                                                            <option value="weekly">weekly</option>
                                                            <option value="as needed">as needed</option>
                                                            <option value="2x daily">2x daily</option>
                                                            <option value="3x daily">3x daily</option>
                                                        </select>
                                                        <Button
                                                            onClick={() => handleRemoveProductFromRecommendations(rec.product_id)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="p-1 text-red-600 hover:text-red-700"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveCategory}>
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Product Search Modal */}
            {showProductSearch && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[#2C2C2C]">Add Product to Recommendations</h2>
                                <button
                                    onClick={() => {
                                        setShowProductSearch(false);
                                        setProductSearch('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search products..."
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Products List */}
                            <div className="max-h-96 overflow-y-auto">
                                {filteredProducts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No products found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredProducts.map((product) => {
                                            const isAlreadyAdded = formData.recommendations.some(rec => rec.product_id === product.id);
                                            return (
                                                <div
                                                    key={product.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg border ${isAlreadyAdded
                                                        ? 'bg-green-50 border-green-200'
                                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div>
                                                        <p className="font-medium text-sm">{product.name}</p>
                                                        <p className="text-xs text-gray-500">Ksh {product.price}</p>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleAddProductToRecommendations(product)}
                                                        disabled={isAlreadyAdded}
                                                        size="sm"
                                                        variant={isAlreadyAdded ? "secondary" : "default"}
                                                    >
                                                        {isAlreadyAdded ? "Added" : "Add"}
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminHealth;