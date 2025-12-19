import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { ProductCard, Product } from '../components/ProductCard';
import { mockProducts } from '../data/mockData';
import { useLoaderData, useParams } from 'react-router';
import { getCategories } from '../hooks/services';

// Mock UI components
const Button = ({ children, className, variant, onClick }) => {
  let baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDA15E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  if (variant === 'outline') {
    baseClasses += ' border border-[#DDA15E] text-[#BC6C25] hover:bg-[#FEFAE0]/70';
  } else if (variant === 'ghost') {
    baseClasses += ' text-[#99582A] hover:text-[#99582A] hover:bg-[#FFE6A7]';
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

const Select = ({ children, value, onValueChange }) => (
  <div className="relative">
    {children}
  </div>
);

const SelectTrigger = ({ children, className }) => (
  <button className={`flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 ${className}`}>
    {children}
    <ChevronDown className="w-4 h-4" />
  </button>
);

const SelectValue = () => null;

const SelectContent = ({ children }) => (
  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
    {children}
  </div>
);

const SelectItem = ({ children, value, onClick }) => (
  <button
    className="w-full px-3 py-2 text-left hover:bg-gray-100"
    onClick={() => onClick && onClick(value)}
  >
    {children}
  </button>
);

const Slider = ({ min, max, step, value, onValueChange, className }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([parseInt(e.target.value), value[1]])}
    className={`w-full ${className}`}
  />
);

const Checkbox = ({ id }) => (
  <input type="checkbox" id={id} className="w-4 h-4" />
);

const Sheet = ({ children }) => children;

const SheetTrigger = ({ asChild, children }) => children;

const SheetContent = ({ children, side, className }) => (
  <div className={`fixed ${side}-0 top-0 h-full bg-white shadow-lg z-50 ${className}`}>
    {children}
  </div>
);

const SheetHeader = ({ children }) => children;

const SheetTitle = ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>;

export function SingleCategoryPage({ onNavigate, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('featured');

  const {categoryId} = useParams()
  
  const [categories, setCategories] = useState([])
    
  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories()
      setCategories(data)
    }
    loadCategories();
  }, [])


  function getCategoryNames(data) {
    return data.map(c => c.name);
  }

  const names = getCategoryNames(categories);

  const filters = [
    {
      title: 'Category',
      options: names,
    },
    {
      title: 'Brand',
      options: ['Brand A', 'Brand B', 'Brand C', 'Brand D'],
    },
    {
      title: 'Availability',
      options: ['In Stock', 'Out of Stock', 'Pre-order'],
    },
  ];

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Price Filter */}
      <div>
        <h4 className="mb-4 text-[#2C2C2C]">Price Range</h4>
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Other Filters */}
      {filters.map((filter, idx) => (
        <div key={idx}>
          <button className="flex items-center justify-between w-full mb-3 text-[#2C2C2C]">
            <h4>{filter.title}</h4>
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="space-y-2">
            {filter.options.map((option, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <Checkbox id={`${filter.title}-${optIdx}`} />
                <label
                  htmlFor={`${filter.title}-${optIdx}`}
                  className="text-sm text-[#2C2C2C] cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Reset Filters */}
      <Button
        variant="outline"
        className="w-full border-[#99582A] text-[#99582A] hover:bg-[#FFE6A7]"
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-[#2C2C2C]">All Products</h1>
        <p className="text-muted-foreground">Showing {mockProducts.length} products</p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters - Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort By */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={(id) => onNavigate('product', { id })}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={isInWishlist ? isInWishlist(product.id) : false}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button className="bg-[#99582A] hover:bg-[#99582A]/90">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}