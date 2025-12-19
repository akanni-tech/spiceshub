import React, { useEffect, useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from '../hooks/services';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';


const cn = (...classes) => classes.filter(Boolean).join(' ');

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


function ValuePacksPage({ onNavigate, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('all');

  // Filter for new arrivals
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
    
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts()
      setProducts(data)
      setLoading(false)
    }
    loadProducts();
  }, [])

  const newProducts = products.filter(p => p.isNew);

  const sortedProducts = [...newProducts].sort((a, b) => {
  switch (sortBy) {
    case "newest":
      return new Date(b.createdAt) - new Date(a.createdAt);
    case "price-low":
      return a.price - b.price;
    case "price-high":
      return b.price - a.price;
    case "popular":
      return b.reviewCount - a.reviewCount;
    default:
      return 0;
  }
});

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-[#99582A] to-[#99582A]/80 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FFE6A7] text-[#99582A] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Just Landed</span>
          </div>
          <h1 className="mb-4 text-white">Value Packs</h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Value packs are starter packs for specific cuisines and branded spice blends
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-[#2C2C2C]">{newProducts.length} New Products</h2>
            <p className="text-sm text-muted-foreground">Updated this week</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            {/* <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <NativeSelect
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-[160px] px-3 py-2 border border-gray-200 rounded"
              >
                <option value="all">All Categories</option>
                <option value="furniture">Furniture</option>
                <option value="decor">Home Decor</option>
                <option value="accessories">Accessories</option>
                <option value="lifestyle">Lifestyle</option>
              </NativeSelect>
            </div> */}

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <NativeSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-[160px] px-3 py-2 border border-gray-200 rounded"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </NativeSelect>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        {/* <div className="bg-[#FFE6A7] rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-[#99582A] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-[#2C2C2C] mb-2">Be the First to Know</h3>
              <p className="text-[#2C2C2C]/80 text-sm mb-3">
                Get exclusive early access to new arrivals by subscribing to our newsletter.
                Limited quantities available.
              </p>
              <button className="px-4 py-2 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90">
                Subscribe Now
              </button>
            </div>
          </div>
        </div> */}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>


        {/* Empty State */}
        {newProducts.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-[#2C2C2C]">No New Arrivals Yet</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon for our latest products!
            </p>
            <button
              onClick={() => onNavigate('category')}
              className="px-6 py-3 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90"
            >
              Browse All Products
            </button>
          </div>
        )}

        {/* Load More */}
        {newProducts.length > 8 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 border border-[#99582A] text-[#99582A] rounded hover:bg-[#FFE6A7]">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ValuePacksPage;