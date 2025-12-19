import React, { useEffect, useState } from 'react';
import { Tag, Clock, TrendingDown, ChevronDown } from 'lucide-react';
import { mockProducts } from '../data/mockData';
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

function SalePage({ onNavigate, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [sortBy, setSortBy] = useState('discount');
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

  const saleProducts = products.filter(p => p.isSale);

  // Calculate savings
  const totalSavings = saleProducts.reduce((sum, product) => {
    if (product.originalPrice) {
      return sum + (product.originalPrice - product.price);
    }
    return sum;
  }, 0);

  // Sort based on select option
  const sortedProducts = [...saleProducts].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        const discountA = (a.originalPrice ?? a.price) - a.price;
        const discountB = (b.originalPrice ?? b.price) - b.price;
        return discountB - discountA;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-500 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full mb-6">
            <Tag className="w-4 h-4" />
            <span className="text-sm">Limited Time Offer</span>
          </div>
          <h1 className="mb-4 text-white">Sale Event</h1>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Save big on your favorite items. Up to 50% off selected products.
          </p>

          {/* Countdown Timer */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg">
            <Clock className="w-5 h-5" />
            <span>Sale ends in:</span>
            <div className="flex gap-2 ml-2">
              <div className="bg-white/20 px-3 py-1 rounded">
                <span>2d</span>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded">
                <span>14h</span>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded">
                <span>32m</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#FFE6A7] rounded-lg p-6 text-center">
            <TrendingDown className="w-8 h-8 mx-auto mb-3 text-[#99582A]" />
            <div className="mb-1 text-[#99582A]">Up to 50% Off</div>
            <p className="text-sm text-[#2C2C2C]/80">Maximum discount</p>
          </div>
          <div className="bg-[#FFE6A7] rounded-lg p-6 text-center">
            <Tag className="w-8 h-8 mx-auto mb-3 text-[#99582A]" />
            <div className="mb-1 text-[#99582A]">{saleProducts.length} Items</div>
            <p className="text-sm text-[#2C2C2C]/80">On sale now</p>
          </div>
          <div className="bg-[#FFE6A7] rounded-lg p-6 text-center">
            <span className="text-3xl block mb-3">💰</span>
            <div className="mb-1 text-[#99582A]">ksh {totalSavings.toFixed(2)}</div>
            <p className="text-sm text-[#2C2C2C]/80">Total savings available</p>
          </div>
        </div>

        {/* Flash Deals Section */}
        <div className="bg-gradient-to-r from-[#99582A] to-[#99582A]/90 rounded-lg p-8 mb-12 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="mb-2">⚡ Flash Deals</h2>
              <p className="text-white/90">Limited stock - Grab them before they're gone!</p>
            </div>
            <span className="px-3 py-1 bg-white text-[#99582A] rounded text-sm font-medium">Ending Soon</span>
          </div>
          {/* <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>67% claimed</span>
              <span>33% remaining</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </div> */}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-[#2C2C2C]">All Sale Items</h2>
            <p className="text-sm text-muted-foreground">
              {saleProducts.length} products • Save up to ksh {totalSavings.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <NativeSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-[180px] px-3 py-2 border border-gray-200 outline-gray-400 rounded"
            >
              <option value="discount">Biggest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </NativeSelect>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
        </div>


        {/* Empty State */}
        {saleProducts.length === 0 && (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-[#2C2C2C]">No Sale Items Available</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon for amazing deals!
            </p>
            <button
              onClick={() => onNavigate('category')}
              className="px-6 py-3 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90"
            >
              Browse All Products
            </button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-[#F0F0F0] rounded-lg p-8 text-center">
          <h3 className="mb-3 text-[#2C2C2C]">Never Miss a Sale</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Subscribe to get exclusive early access to sales and special discount codes.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-200 rounded bg-gray-50"
            />
            <button className="px-4 py-2 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalePage;