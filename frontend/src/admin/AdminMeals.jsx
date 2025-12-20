import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChefHat, Eye, EyeOff, X, Search } from 'lucide-react';
import { getMeals, getProducts, createMeal, updateMeal, deleteMeal } from '../hooks/services';

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
        className={`px-4 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A] ${className}`}
        {...props}
    />
);

const Textarea = ({ placeholder, className, value, onChange, ...props }) => (
    <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-4 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A] ${className}`}
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

const AdminMeals = () => {
    const [meals, setMeals] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMeal, setEditingMeal] = useState(null);
    const [showProductSearch, setShowProductSearch] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        serves: 4,
        recipe: '',
        add_ons: [],
        is_active: true,
        items: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [mealsData, productsData] = await Promise.all([
                getMeals(),
                getProducts()
            ]);
            setMeals(mealsData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMeals = async () => {
        try {
            const data = await getMeals();
            setMeals(data);
        } catch (error) {
            console.error('Error loading meals:', error);
        }
    };

    const handleAddMeal = () => {
        setFormData({
            name: '',
            description: '',
            image: '',
            serves: 4,
            recipe: '',
            add_ons: [],
            is_active: true,
            items: []
        });
        setEditingMeal(null);
        setShowAddModal(true);
    };

    const handleEditMeal = (meal) => {
        setFormData({
            name: meal.name,
            description: meal.description,
            image: meal.image,
            serves: meal.serves,
            recipe: meal.recipe,
            add_ons: meal.add_ons || [],
            is_active: meal.is_active,
            items: meal.items || []
        });
        setEditingMeal(meal);
        setShowAddModal(true);
    };

    const handleAddProductToBundle = (product) => {
        const existingItem = formData.items.find(item => item.product_id === product.id);
        if (existingItem) {
            // Update quantity if already exists
            setFormData({
                ...formData,
                items: formData.items.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            });
        } else {
            // Add new item
            setFormData({
                ...formData,
                items: [...formData.items, {
                    product_id: product.id,
                    product_name: product.name,
                    quantity: 1,
                    unit: 'tsp'
                }]
            });
        }
        setShowProductSearch(false);
        setProductSearch('');
    };

    const handleRemoveProductFromBundle = (productId) => {
        setFormData({
            ...formData,
            items: formData.items.filter(item => item.product_id !== productId)
        });
    };

    const handleUpdateProductQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            handleRemoveProductFromBundle(productId);
            return;
        }
        setFormData({
            ...formData,
            items: formData.items.map(item =>
                item.product_id === productId
                    ? { ...item, quantity: parseFloat(quantity) }
                    : item
            )
        });
    };

    const handleUpdateProductUnit = (productId, unit) => {
        setFormData({
            ...formData,
            items: formData.items.map(item =>
                item.product_id === productId
                    ? { ...item, unit }
                    : item
            )
        });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
    );

    const handleSaveMeal = async () => {
        try {
            if (editingMeal) {
                await updateMeal(editingMeal.id, formData);
            } else {
                await createMeal(formData);
            }
            setShowAddModal(false);
            loadMeals(); // Refresh the list
        } catch (error) {
            console.error('Error saving meal:', error);
            alert('Failed to save meal. Please try again.');
        }
    };

    const handleToggleActive = async (meal) => {
        try {
            await updateMeal(meal.id, { ...meal, is_active: !meal.is_active });
            loadMeals(); // Refresh the list
        } catch (error) {
            console.error('Error toggling meal status:', error);
            alert('Failed to update meal status. Please try again.');
        }
    };

    const handleDeleteMeal = async (mealId) => {
        if (!confirm('Are you sure you want to delete this meal?')) return;

        try {
            await deleteMeal(mealId);
            loadMeals(); // Refresh the list
        } catch (error) {
            console.error('Error deleting meal:', error);
            alert('Failed to delete meal. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#2C2C2C]">Meal Management</h1>
                    <p className="text-gray-600">Create and manage meal recipes with spice bundles</p>
                </div>
                <Button onClick={handleAddMeal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Meal
                </Button>
            </div>

            {/* Meals Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="p-6">
                            <div className="animate-pulse">
                                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {meals.map((meal) => (
                        <Card key={meal.id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="aspect-square bg-[#F0F0F0] rounded-lg mb-4 flex items-center justify-center">
                                <img src={meal.image || '/spices4.jpeg'} alt={meal.name} className="w-full h-full object-cover rounded-lg" />
                            </div>

                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-[#2C2C2C]">{meal.name}</h3>
                                <Badge variant={meal.is_active ? 'success' : 'default'}>
                                    {meal.is_active ? 'Active' : 'Draft'}
                                </Badge>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{meal.description}</p>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500">Serves {meal.serves}</span>
                                <span className="text-sm text-gray-500">{meal.items?.length || 0} spices</span>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditMeal(meal)}
                                    className="flex-1"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleActive(meal)}
                                    className="px-2"
                                >
                                    {meal.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteMeal(meal.id)}
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
                                    {editingMeal ? 'Edit Meal' : 'Add New Meal'}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                                        <Input
                                            placeholder="e.g., Pilau Night"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                                        <Input
                                            type="number"
                                            placeholder="4"
                                            value={formData.serves}
                                            onChange={(e) => setFormData({ ...formData, serves: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <Textarea
                                        placeholder="Brief description of the meal"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipe</label>
                                    <Textarea
                                        placeholder="Simple recipe instructions (1-2 steps)"
                                        value={formData.recipe}
                                        onChange={(e) => setFormData({ ...formData, recipe: e.target.value })}
                                        rows={4}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Add-ons (Optional)</label>
                                    <Input
                                        placeholder="e.g., Extra Garlic, Fresh Ginger"
                                        value={formData.add_ons.join(', ')}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            add_ons: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                        })}
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

                                {/* Spice Bundle Section */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Spice Bundle</h3>
                                        <Button
                                            onClick={() => setShowProductSearch(true)}
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Product
                                        </Button>
                                    </div>

                                    {formData.items.length === 0 ? (
                                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                                            <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500">No spices added yet</p>
                                            <p className="text-sm text-gray-400">Click "Add Product" to start building your spice bundle</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {formData.items.map((item) => (
                                                <div key={item.product_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{item.product_name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleUpdateProductQuantity(item.product_id, e.target.value)}
                                                            className="w-20 text-sm"
                                                            min="0.1"
                                                            step="0.1"
                                                        />
                                                        <select
                                                            value={item.unit}
                                                            onChange={(e) => handleUpdateProductUnit(item.product_id, e.target.value)}
                                                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                        >
                                                            <option value="tsp">tsp</option>
                                                            <option value="tbsp">tbsp</option>
                                                            <option value="cups">cups</option>
                                                            <option value="pieces">pieces</option>
                                                            <option value="pods">pods</option>
                                                            <option value="sticks">sticks</option>
                                                        </select>
                                                        <Button
                                                            onClick={() => handleRemoveProductFromBundle(item.product_id)}
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
                                <Button onClick={handleSaveMeal}>
                                    {editingMeal ? 'Update Meal' : 'Create Meal'}
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
                                <h2 className="text-xl font-bold text-[#2C2C2C]">Add Product to Bundle</h2>
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
                                            const isAlreadyAdded = formData.items.some(item => item.product_id === product.id);
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
                                                        onClick={() => handleAddProductToBundle(product)}
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

export default AdminMeals;