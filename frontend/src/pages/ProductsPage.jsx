import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ChevronDown, SlidersHorizontal, ShoppingCart, Heart, X, Check } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import DualRangeSlider from '../components/Slider';
import { getCategories, getProducts } from '../hooks/services';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';



const cn = (...classes) => classes.filter(Boolean).join(' ');

// Button Component
const Button = ({ children, className = '', variant, size, onClick, disabled, ...props }) => {
  let baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDA15E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  if (size === 'icon') {
    baseClasses += ' w-9 h-9 p-0';
  } else {
    baseClasses += ' h-10 px-4 py-2';
  }

  if (variant === 'outline') {
    baseClasses += ' border border-[#DDA15E] text-[#BC6C25] hover:bg-[#FEFAE0]/70';
  } else if (className.includes('bg-[#BC6C25]')) {
    // Primary color
  } else {
    baseClasses += ' bg-gray-200 text-gray-800 hover:bg-gray-300';
  }

  return (
    <button
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Checkbox Component
const Checkbox = ({ id, checked, onCheckedChange, disabled, ...props }) => (
  <input 
    id={id} 
    type="checkbox" 
    checked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    disabled={disabled}
    className="w-4 h-4 rounded border-gray-300 text-[#BC6C25] focus:ring-[#DDA15E] disabled:opacity-50 cursor-pointer"
    {...props}
  />
);

// Select Component
const NativeSelect = ({ value, onChange, children, className }) => (
  <div className="relative w-full">
    <select 
      value={value} 
      onChange={onChange}
      className={cn(
        "appearance-none block w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DDA15E] focus:border-[#DDA15E] pr-8",
        className
      )}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

// Sheet Components
const SheetContext = React.createContext({});

const Sheet = ({ children }) => {
  const [open, setOpen] = useState(false);
  
  const allChildren = React.Children.toArray(children);
  const triggerElement = allChildren.find(child => child.type === SheetTrigger);
  const contentElement = allChildren.find(child => child.type === SheetContent);
  const contentProps = contentElement ? contentElement.props : {};
  
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {triggerElement}
      <SheetDrawer
        open={open}
        setOpen={setOpen}
        side={contentProps.side}
        children={contentProps.children} 
      />
    </SheetContext.Provider>
  );
};

const SheetTrigger = ({ asChild, children }) => {
  const { setOpen } = React.useContext(SheetContext);
  const triggerElement = asChild ? React.Children.only(children) : <Button>{children}</Button>;
  
  return React.cloneElement(triggerElement, {
    onClick: (e) => {
      e.stopPropagation();
      setOpen(true);
    },
  });
};

const SheetContent = ({ children }) => null;

const SheetDrawer = ({ children, side = 'left', open, setOpen }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsRendered(true);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      if (!isRendered) return;
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open, isRendered]);

  if (!isRendered) return null;

  const initialClass = side === 'left' ? '-translate-x-full' : 'translate-x-full';
  const finalClass = 'translate-x-0';
  const sheetClass = isVisible ? finalClass : initialClass;

  return (
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isVisible ? 'bg-black/50 opacity-100' : 'bg-black/0 opacity-0'}`} 
      onClick={() => setOpen(false)}
    >
      <div 
        className={`fixed inset-y-0 w-3/4 max-w-sm bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${side === 'left' ? 'left-0' : 'right-0'} ${sheetClass}`}
        onClick={e => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-[#BC6C25] transition-colors" 
          onClick={() => setOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

const SheetHeader = ({ children }) => <div className="mb-6">{children}</div>;
const SheetTitle = ({ children }) => <h2 className="text-xl font-bold text-[#2C2C2C]">{children}</h2>;

// Category Page Component
export function CategoryPage({ onNavigate, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts()
      setProducts(data)
      setDisplayedProducts(data)
      setLoading(false)
    }
    loadProducts();
  }, [])

  const [allCategories, setAllCategories] = useState([])

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories()
      setAllCategories(data)
    }
    loadCategories();
  }, [])


  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [displayedProducts, setDisplayedProducts] = useState(products);

  const categories = useMemo(() => {
    return allCategories.map(c => c.name);
  }, [allCategories]);
  const brands = useMemo(() => ['Brand A', 'Brand B', 'Brand C', 'Brand D'], []);
  const availability = useMemo(() => ['In Stock', 'Out of Stock'], []);

  const PRICE_MIN = 0;
  const PRICE_MAX = 10000;

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: PRICE_MIN, max: PRICE_MAX });
  };

  // Handle price range change from slider
  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
  };

  // Filtering logic
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category?.name));
    }

    // Filter by price
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        break;
    }

    setDisplayedProducts(filtered);
  }, [products, selectedCategories, priceRange, sortBy]);


  const FilterSidebar = useCallback(() => (
    <div className="space-y-8 p-2">
      {/* Price Filter with Slider */}
      <div>
        <h4 className="mb-5 text-lg font-semibold text-[#2C2C2C]">Price Range</h4>
        <DualRangeSlider 
          min={PRICE_MIN}
          max={PRICE_MAX}
          initialMin={priceRange.min}
          initialMax={priceRange.max}
          onChange={handlePriceRangeChange}
        />
      </div>

      {/* Categories */}
      <div className="border-t pt-6 border-gray-100">
        <button className="flex items-center justify-between w-full mb-3 text-[#2C2C2C]">
          <h4 className="font-semibold">Category</h4>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-3">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <label htmlFor={category} className="cursor-pointer text-sm">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <Button
        variant="outline"
        className="w-full mt-6 border-[#BC6C25] text-[#BC6C25] hover:bg-[#DDA15E] hover:text-white font-bold"
        onClick={clearFilters}
      >
        Reset Filters
      </Button>
    </div>
  ), [priceRange, categories, brands, availability, selectedCategories, PRICE_MIN, PRICE_MAX]);

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <div className="flex gap-10">
        {/* Desktop Filters - Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-6">
            <FilterSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#DDA15E]/50">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden text-[#BC6C25] border-[#BC6C25]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort By */}
            <div className="flex items-center gap-3 ml-auto lg:ml-0">
              <span className="text-sm text-gray-600 font-semibold whitespace-nowrap">Sort by:</span>
              <NativeSelect 
                className="w-full sm:w-[200px]"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Best Rating</option>
              </NativeSelect>
            </div>
          </div>

          {/* Product Grid */}
          <div>
            {loading ? (
              // 🧱 Show skeletons while loading
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : displayedProducts.length > 0 ? (
                // 🛍️ Show actual products once loaded
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={onAddToCart}
                      onClick={() => onNavigate?.('product', { product })}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-gray-500 mb-4">
                    No products found matching your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="border-[#BC6C25] text-[#BC6C25] hover:bg-[#DDA15E] hover:text-white font-bold"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>


            {/* Pagination */}
            {displayedProducts.length > 0 && (
              <div className="flex justify-center gap-2 mt-16">
                <Button variant="outline" className="text-gray-500 border-gray-300" disabled>
                  Previous
                </Button>
                <Button className="bg-[#BC6C25] hover:bg-[#DDA15E] text-white">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default CategoryPage;
