import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { mockProducts, categories } from '../data/mockData';

function SingleCategoryPage({ categoryId = 'furniture', onNavigate, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('featured');

  const category = categories.find(c => c.id === categoryId) || categories[0];

  // In a real app, filter products by category
  const categoryProducts = mockProducts;

  const subCategories = [
    'Sofas & Couches',
    'Chairs',
    'Tables',
    'Storage',
    'Beds',
    'Lighting',
  ];

  const filters = [
    {
      title: 'Material',
      options: ['Wood', 'Metal', 'Fabric', 'Leather', 'Glass'],
    },
    {
      title: 'Style',
      options: ['Modern', 'Contemporary', 'Traditional', 'Industrial', 'Scandinavian'],
    },
    {
      title: 'Color',
      options: ['Black', 'White', 'Brown', 'Gray', 'Natural'],
    },
  ];

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Sub-categories */}
      <div>
        <h4 className="mb-4 text-[#2C2C2C]">Categories</h4>
        <div className="space-y-2">
          {subCategories.map((subcat, idx) => (
            <button
              key={idx}
              className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-[#FFE6A7] text-[#2C2C2C] transition-colors"
            >
              {subcat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="mb-4 text-[#2C2C2C]">Price Range</h4>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
          className="w-full mb-4 accent-[#99582A]"
        />
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full mb-4 accent-[#99582A]"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Other Filters */}
      {filters.map((filter, idx) => (
        <div key={idx} className="pt-6 border-t border-gray-200">
          <button className="flex items-center justify-between w-full mb-3 text-[#2C2C2C]">
            <h4>{filter.title}</h4>
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="space-y-2">
            {filter.options.map((option, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${filter.title}-${optIdx}`}
                  className="w-4 h-4"
                />
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
      <button className="w-full px-4 py-2 border border-[#99582A] text-[#99582A] rounded hover:bg-[#FFE6A7]">
        Reset Filters
      </button>
    </div>
  );

  return (
    <div>
      {/* Category Hero */}
      <section className="relative h-[300px] bg-[#F0F0F0]">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-[#2C2C2C]">{category.name}</h1>
            <p className="text-muted-foreground">
              {category.productCount} Products Available
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => onNavigate('home')} className="hover:text-[#99582A]">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('category')} className="hover:text-[#99582A]">
            Categories
          </button>
          <span>/</span>
          <span className="text-[#2C2C2C]">{category.name}</span>
        </div>

        {/* Description */}
        <div className="mb-8 p-6 bg-[#FFE6A7] rounded-lg">
          <p className="text-[#2C2C2C]/80">
            Explore our curated collection of {category.name.toLowerCase()}. From timeless classics to
            contemporary designs, find pieces that perfectly complement your space and lifestyle.
          </p>
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
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              {/* Mobile Filter Button */}
              <button className="lg:hidden px-4 py-2 border border-gray-200 rounded">
                <SlidersHorizontal className="w-4 h-4 mr-2 inline" />
                Filters
              </button>

              <div className="hidden lg:block">
                <p className="text-sm text-muted-foreground">
                  Showing {categoryProducts.length} products
                </p>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-[180px] px-3 py-2 border border-gray-200 rounded bg-gray-50 accent-[#99582A]"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rating</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {categoryProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg shadow-sm bg-white p-4">
                  <button
                    onClick={() => onNavigate('product', { id: product.id })}
                    className="w-full aspect-square mb-4 bg-[#F0F0F0] rounded overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </button>

                  <div className="space-y-2">
                    <button
                      onClick={() => onNavigate('product', { id: product.id })}
                      className="text-left hover:text-[#99582A] transition-colors"
                    >
                      <h3 className="text-[#2C2C2C] text-sm line-clamp-2">{product.name}</h3>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-[#99582A] font-medium">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full px-3 py-2 bg-[#99582A] text-white text-sm rounded hover:bg-[#99582A]/90"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded opacity-50 cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-2 bg-[#99582A] text-white rounded hover:bg-[#99582A]/90">1</button>
              <button className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-50">2</button>
              <button className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-50">3</button>
              <button className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>

        {/* Category Info Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="mb-4 text-[#2C2C2C]">About Our {category.name}</h2>
              <p className="text-muted-foreground mb-4">
                Each piece in our {category.name.toLowerCase()} collection is carefully selected
                for its quality, design, and craftsmanship. We partner with renowned manufacturers
                who share our commitment to excellence.
              </p>
              <p className="text-muted-foreground">
                Whether you're furnishing a new space or updating your current one, our collection
                offers versatile options to suit any style and budget.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-[#2C2C2C]">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#99582A] mt-1">✓</span>
                  <span className="text-muted-foreground">Premium quality materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#99582A] mt-1">✓</span>
                  <span className="text-muted-foreground">Sustainable sourcing practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#99582A] mt-1">✓</span>
                  <span className="text-muted-foreground">Expert customer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#99582A] mt-1">✓</span>
                  <span className="text-muted-foreground">Fast, reliable shipping</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleCategoryPage;