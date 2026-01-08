import React, { useState, useEffect } from 'react';
import { ChefHat, Heart, Sparkles, ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { getMeals, getHealthCategories, getProducts } from '../hooks/services';
import { toast } from 'sonner';

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

// Mock data for meals and health categories
const mockMeals = [
    {
        id: 'pilau-night',
        name: 'Pilau Night',
        description: 'Perfect blend for authentic Swahili rice pilau',
        image: '/spices4.jpeg',
        serves: 4,
        spiceBundle: [
            { productId: 'cumin', name: 'Cumin', quantity: 2, unit: 'tsp' },
            { productId: 'coriander', name: 'Coriander', quantity: 1, unit: 'tbsp' },
            { productId: 'cardamom', name: 'Cardamom', quantity: 4, unit: 'pods' },
            { productId: 'cloves', name: 'Cloves', quantity: 6, unit: 'pieces' },
            { productId: 'cinnamon', name: 'Cinnamon', quantity: 1, unit: 'stick' },
        ],
        recipe: 'Add spices to cooking oil, fry for 2 minutes, then add rice and broth. Cook until rice is tender.',
        addOns: ['Extra Garlic', 'Fresh Ginger', 'Black Pepper']
    },
    {
        id: 'nyama-choma',
        name: 'Nyama Choma',
        description: 'Traditional Kenyan grilled meat seasoning',
        image: '/spices4.jpeg',
        serves: 6,
        spiceBundle: [
            { productId: 'salt', name: 'Sea Salt', quantity: 2, unit: 'tbsp' },
            { productId: 'black-pepper', name: 'Black Pepper', quantity: 1, unit: 'tbsp' },
            { productId: 'garlic-powder', name: 'Garlic Powder', quantity: 1, unit: 'tbsp' },
            { productId: 'paprika', name: 'Paprika', quantity: 2, unit: 'tsp' },
        ],
        recipe: 'Mix all spices and rub generously on meat 30 minutes before grilling.',
        addOns: ['Rosemary', 'Thyme', 'Lemon Pepper']
    },
    {
        id: 'chai-masala',
        name: 'Chai Masala',
        description: 'Authentic Kenyan tea spices',
        image: '/spices4.jpeg',
        serves: 4,
        spiceBundle: [
            { productId: 'cardamom', name: 'Cardamom', quantity: 6, unit: 'pods' },
            { productId: 'cinnamon', name: 'Cinnamon', quantity: 2, unit: 'sticks' },
            { productId: 'ginger', name: 'Ginger Powder', quantity: 1, unit: 'tsp' },
            { productId: 'cloves', name: 'Cloves', quantity: 4, unit: 'pieces' },
            { productId: 'black-pepper', name: 'Black Pepper', quantity: 4, unit: 'corns' },
        ],
        recipe: 'Add spices to boiling water with tea leaves. Simmer for 5 minutes, then add milk and sugar.',
        addOns: ['Nutmeg', 'Star Anise', 'Fennel Seeds']
    }
];

const mockHealthCategories = [
    {
        id: 'immunity-boost',
        name: 'Immunity Boost',
        description: 'Natural spices to support your immune system',
        icon: '🛡️',
        benefits: 'Turmeric, ginger, and garlic have traditionally been used to support immune function.',
        usage: 'Add to teas, soups, or daily cooking. Use 1-2 times daily.',
        safety: 'Safe for daily use. Consult healthcare provider if pregnant.',
        recommendedProducts: [
            { productId: 'turmeric', name: 'Turmeric', quantity: 1, unit: 'tbsp daily' },
            { productId: 'ginger', name: 'Ginger', quantity: 1, unit: 'tsp daily' },
            { productId: 'garlic', name: 'Garlic Powder', quantity: 1, unit: 'tsp daily' },
            { productId: 'black-pepper', name: 'Black Pepper', quantity: 0.5, unit: 'tsp daily' },
        ]
    },
    {
        id: 'digestion-support',
        name: 'Digestion & Bloating',
        description: 'Gentle spices for digestive comfort',
        icon: '🌿',
        benefits: 'Fennel, cumin, and coriander have been traditionally used to support digestion.',
        usage: 'Brew as tea after meals or add to cooking. Use as needed.',
        safety: 'Generally safe. Reduce if experiencing heartburn.',
        recommendedProducts: [
            { productId: 'fennel', name: 'Fennel Seeds', quantity: 1, unit: 'tsp per cup' },
            { productId: 'cumin', name: 'Cumin', quantity: 1, unit: 'tsp daily' },
            { productId: 'coriander', name: 'Coriander', quantity: 1, unit: 'tsp daily' },
            { productId: 'ginger', name: 'Ginger', quantity: 0.5, unit: 'tsp per cup' },
        ]
    },
    {
        id: 'joint-support',
        name: 'Joint Pain & Inflammation',
        description: 'Spices traditionally used for joint comfort',
        icon: '🦴',
        benefits: 'Turmeric and ginger have been traditionally used to support joint health.',
        usage: 'Add to smoothies, teas, or meals. Use 1-2 times daily.',
        safety: 'Safe for most people. May interact with blood thinners.',
        recommendedProducts: [
            { productId: 'turmeric', name: 'Turmeric', quantity: 1, unit: 'tbsp daily' },
            { productId: 'ginger', name: 'Ginger', quantity: 1, unit: 'tsp daily' },
            { productId: 'black-pepper', name: 'Black Pepper', quantity: 0.5, unit: 'tsp daily' },
            { productId: 'cinnamon', name: 'Cinnamon', quantity: 0.5, unit: 'tsp daily' },
        ]
    }
];

const recommendationRules = {
    cooking: {
        'Pilau': ['cumin', 'coriander', 'cardamom', 'cloves', 'cinnamon'],
        'Beef Stew': ['cumin', 'coriander', 'paprika', 'garlic-powder', 'black-pepper'],
        'Tea': ['cardamom', 'cinnamon', 'ginger', 'cloves', 'black-pepper'],
        'Veggies': ['cumin', 'coriander', 'turmeric', 'garlic-powder', 'ginger'],
        'Fish': ['cumin', 'coriander', 'turmeric', 'garlic-powder', 'paprika']
    },
    health: {
        'Immunity': ['turmeric', 'ginger', 'garlic', 'black-pepper'],
        'Digestion': ['fennel', 'cumin', 'coriander', 'ginger'],
        'Energy': ['cinnamon', 'ginger', 'cardamom', 'cloves'],
        'Joints': ['turmeric', 'ginger', 'black-pepper', 'cinnamon']
    }
};

export function SmartShopPage() {
    const [activeTab, setActiveTab] = useState(() => {
        // Check if user came from landing page with a specific tab preference
        const storedTab = sessionStorage.getItem('smartShopTab');
        if (storedTab) {
            sessionStorage.removeItem('smartShopTab'); // Clear it after use
            return storedTab;
        }
        return 'meals'; // Default to meals
    });
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [selectedHealth, setSelectedHealth] = useState(null);
    const [mealQuantities, setMealQuantities] = useState({});
    const [recommendationStep, setRecommendationStep] = useState('choice');
    const [recommendationType, setRecommendationType] = useState(null);
    const [selectedRecommendation, setSelectedRecommendation] = useState(null);
    const [recommendedBundle, setRecommendedBundle] = useState([]);
    const [meals, setMeals] = useState([]);
    const [healthCategories, setHealthCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { addItem } = useCart();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [mealsData, healthData, productsData] = await Promise.all([
                getMeals(),
                getHealthCategories(),
                getProducts()
            ]);
            setMeals(mealsData);
            setHealthCategories(healthData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error loading smart shop data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMealToCart = async (meal, quantity = 1) => {
        try {
            for (const item of meal.items || []) {
                // Find the corresponding product
                const product = products.find(p => p.id === item.product_id);
                if (product) {
                    // Convert quantity based on unit (assuming meal quantities are in the unit specified)
                    const cartQuantity = Math.round(item.quantity * quantity * 100); // Convert to cart's 100g base unit
                    await addItem(product, cartQuantity);
                }
            }
            toast.success(`Added ${meal.name} spice bundle to cart!`);
        } catch (error) {
            console.error('Error adding meal to cart:', error);
            toast.error('Failed to add meal to cart. Please try again.');
        }
    };

    const handleAddHealthBundleToCart = async (healthCategory) => {
        try {
            for (const rec of healthCategory.recommendations || []) {
                // Find the corresponding product
                const product = products.find(p => p.id === rec.product_id);
                if (product) {
                    // Convert quantity (assuming health recommendations are in grams or similar)
                    const cartQuantity = Math.round(rec.quantity * 100); // Convert to cart's 100g base unit
                    await addItem(product, cartQuantity);
                }
            }
            toast.success(`Added ${healthCategory.name} health bundle to cart!`);
        } catch (error) {
            console.error('Error adding health bundle to cart:', error);
            toast.error('Failed to add health bundle to cart. Please try again.');
        }
    };

    const handleRecommendationChoice = (type) => {
        setRecommendationType(type);
        setRecommendationStep('selection');
    };

    const handleRecommendationSelect = (choice) => {
        setSelectedRecommendation(choice);
        const bundle = recommendationRules[recommendationType][choice] || [];
        setRecommendedBundle(bundle);
        setRecommendationStep('result');
    };

    const handleAddRecommendationToCart = async () => {
        try {
            for (const productId of recommendedBundle) {
                // Find the corresponding product
                const product = products.find(p => p.id === productId);
                if (product) {
                    await addItem(product, 100); // Default quantity of 100g
                }
            }
            alert('Added recommended spice bundle to cart!');
        } catch (error) {
            console.error('Error adding recommendations to cart:', error);
            alert('Failed to add recommendations to cart. Please try again.');
        }
    };

    const resetRecommendation = () => {
        setRecommendationStep('choice');
        setRecommendationType(null);
        setSelectedRecommendation(null);
        setRecommendedBundle([]);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#2C2C2C] mb-4">Cook by Meal & Health</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover perfect spice combinations for your favorite meals and natural wellness support
                </p>
            </div>

            {/* Smart Recommendation Widget */}
            <Card className="p-6 mb-8 bg-gradient-to-r from-[#FFE6A7] to-[#DDA15E]">
                <div className="text-center">
                    <Sparkles className="w-8 h-8 text-[#99582A] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">Not sure what you need?</h2>
                    <p className="text-gray-700 mb-6">Let us help you find the perfect spices!</p>

                    {recommendationStep === 'choice' && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => handleRecommendationChoice('cooking')}
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <ChefHat className="w-5 h-5" />
                                What are you cooking?
                            </Button>
                            <Button
                                onClick={() => handleRecommendationChoice('health')}
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <Heart className="w-5 h-5" />
                                Health & wellness
                            </Button>
                        </div>
                    )}

                    {recommendationStep === 'selection' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">
                                {recommendationType === 'cooking' ? 'What are you cooking today?' : 'What do you want to improve?'}
                            </h3>
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                {Object.keys(recommendationRules[recommendationType]).map((option) => (
                                    <Button
                                        key={option}
                                        variant={selectedRecommendation === option ? 'default' : 'outline'}
                                        onClick={() => handleRecommendationSelect(option)}
                                        className="text-sm"
                                    >
                                        {option}
                                    </Button>
                                ))}
                            </div>
                            <Button variant="outline" onClick={resetRecommendation} className="text-sm">
                                Back
                            </Button>
                        </div>
                    )}

                    {recommendationStep === 'result' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Recommended for you:</h3>
                            <p className="text-gray-700 mb-4">
                                {recommendationType === 'cooking'
                                    ? `Perfect spices for ${selectedRecommendation}`
                                    : `Natural support for ${selectedRecommendation.toLowerCase()}`
                                }
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                {recommendedBundle.map((productId) => (
                                    <Badge key={productId} variant="primary" className="text-xs">
                                        {productId.replace('-', ' ')}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={handleAddRecommendationToCart}>
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add Bundle to Cart
                                </Button>
                                <Button variant="outline" onClick={resetRecommendation}>
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Main Content Tabs */}
            <div className="mb-8">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('meals')}
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'meals'
                            ? 'border-[#99582A] text-[#99582A]'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <ChefHat className="w-4 h-4 inline mr-2" />
                        Shop by Meal
                    </button>
                    <button
                        onClick={() => setActiveTab('health')}
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'health'
                            ? 'border-[#99582A] text-[#99582A]'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Heart className="w-4 h-4 inline mr-2" />
                        Shop by Health
                    </button>
                </div>
            </div>

            {/* Meals Section */}
            {activeTab === 'meals' && (
                <div>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="p-6">
                                    <div className="aspect-square bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                            {meals.map((meal) => (
                                <Card key={meal.id} className="p-4 hover:shadow-lg transition-shadow">
                                    <div className="aspect-square bg-[#F0F0F0] rounded-lg mb-4 flex items-center justify-center">
                                        <img src={meal.image || '/spices4.jpeg'} alt={meal.name} className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#2C2C2C] mb-2">{meal.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{meal.description}</p>
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge variant="primary">Serves {meal.serves}</Badge>
                                        <span className="text-sm text-gray-500">{meal.items?.length || 0} spices</span>
                                    </div>
                                    <Button
                                        onClick={() => setSelectedMeal(meal)}
                                        className="w-full"
                                    >
                                        View Recipe & Add to Cart
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Health Section */}
            {activeTab === 'health' && (
                <div>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="p-6">
                                    <div className="text-4xl mb-4 bg-gray-200 rounded animate-pulse h-12"></div>
                                    <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {healthCategories.map((category) => (
                                <Card key={category.id} className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="text-4xl mb-4">{category.icon || '🌿'}</div>
                                    <h3 className="text-xl font-semibold text-[#2C2C2C] mb-2">{category.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                                    <p className="text-sm text-gray-700 mb-4">{category.benefits}</p>
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge variant="success">{category.recommendations?.length || 0} products</Badge>
                                    </div>
                                    <Button
                                        onClick={() => setSelectedHealth(category)}
                                        className="w-full"
                                    >
                                        View Details & Add Bundle
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Meal Detail Modal */}
            {selectedMeal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-[#2C2C2C]">{selectedMeal.name}</h2>
                                <button
                                    onClick={() => setSelectedMeal(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <img src={selectedMeal.image} alt={selectedMeal.name} className="w-full rounded-lg" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Spice Bundle:</h3>
                                    <ul className="space-y-1 mb-4">
                                        {selectedMeal.items?.map((item, index) => (
                                            <li key={index} className="text-sm text-gray-600">
                                                • {item.product_name}: {item.quantity} {item.unit}
                                            </li>
                                        )) || []}
                                    </ul>

                                    <h3 className="font-semibold mb-2">Simple Recipe:</h3>
                                    <p className="text-sm text-gray-600 mb-4">{selectedMeal.recipe}</p>

                                    {(selectedMeal.addOns && selectedMeal.addOns.length > 0) && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Optional Add-ons:</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedMeal.addOns.map((addOn, index) => (
                                                    <Badge key={index} variant="default" className="text-xs">
                                                        {addOn}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded">
                                        <button
                                            onClick={() => setMealQuantities(prev => ({ ...prev, [selectedMeal.id]: Math.max(1, (prev[selectedMeal.id] || 1) - 1) }))}
                                            className="px-2 py-1 hover:bg-gray-100"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-3 py-1 text-sm">{mealQuantities[selectedMeal.id] || 1}</span>
                                        <button
                                            onClick={() => setMealQuantities(prev => ({ ...prev, [selectedMeal.id]: (prev[selectedMeal.id] || 1) + 1 }))}
                                            className="px-2 py-1 hover:bg-gray-100"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => {
                                        handleAddMealToCart(selectedMeal, mealQuantities[selectedMeal.id] || 1);
                                        setSelectedMeal(null);
                                    }}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add All to Cart
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Health Detail Modal */}
            {selectedHealth && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-[#2C2C2C]">{selectedHealth.icon} {selectedHealth.name}</h2>
                                <button
                                    onClick={() => setSelectedHealth(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Traditional Benefits:</h3>
                                    <p className="text-gray-600">{selectedHealth.benefits}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">How to Use:</h3>
                                    <p className="text-gray-600">{selectedHealth.usage}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Recommended Products:</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedHealth.recommendations?.map((rec, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                                <span className="text-sm font-medium">{rec.product_name}</span>
                                                <span className="text-sm text-gray-600">{rec.quantity} {rec.unit}</span>
                                            </div>
                                        )) || []}
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2 text-yellow-800">Safety Notes:</h3>
                                    <p className="text-sm text-yellow-700">{selectedHealth.safety}</p>
                                </div>

                                <Button
                                    onClick={() => {
                                        handleAddHealthBundleToCart(selectedHealth);
                                        setSelectedHealth(null);
                                    }}
                                    className="w-full"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add Recommended Bundle to Cart
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default SmartShopPage;