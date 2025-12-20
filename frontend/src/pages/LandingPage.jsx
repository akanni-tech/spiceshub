import React, { useEffect, useState } from 'react';
import { ArrowRight, Truck, Shield, RefreshCw, HeadphonesIcon } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { mockProducts, categories, testimonials } from '../data/mockData';
import { getCategories, getProducts } from '../hooks/services';
import { Link } from 'react-router';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';

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

const ImageWithFallback = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} />
);

const Newsletter = () => (
  <section className="py-16 bg-[#F0F0F0]">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="mb-4 text-[#2C2C2C]">Stay Updated</h2>
      <p className="mb-6 text-muted-foreground">Subscribe to our newsletter for the latest updates and offers</p>
      <div className="flex gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A]"
        />
        <Button className="bg-[#99582A] hover:bg-[#99582A]/90 text-white px-6">
          Subscribe
        </Button>
      </div>
    </div>
  </section>
);

export function LandingPage({ onNavigate, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts()
      setProducts(data)
      setLoadingProducts(false)
    }
    loadProducts();
  }, [])

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories()
      setCategories(data)
      setLoadingCategories(false)
    }
    loadCategories();
  }, [])

  const featuredProducts = products.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
  const newArrivals = products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-[#FFE6A7]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/spices4.jpeg"
            alt="Hero"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="mb-4 text-[#99582A] text-4xl font-bold">Discover Your Next Favorite Spice</h1>
            <p className="mb-6 text-[#2C2C2C] text-lg">
              Curated collections of premium spices and herbs, sourced for freshness, aroma, and bold flavor.
            </p>
            <div className="flex gap-4">
              <Link to={"/products"}>
                <Button
                  className="bg-[#99582A] p-2 hover:bg-[#99582A]/90"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Truck className="w-10 h-10 mx-auto mb-3 text-[#99582A]" />
              <h4 className="mb-2 text-[#2C2C2C]">Free Shipping</h4>
              <p className="text-sm text-gray-600">On orders around CBD and Kasarani</p>
            </div>
            <div className="text-center">
              <Shield className="w-10 h-10 mx-auto mb-3 text-[#99582A]" />
              <h4 className="mb-2 text-[#2C2C2C]">Secure Payment</h4>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center">
              <HeadphonesIcon className="w-10 h-10 mx-auto mb-3 text-[#99582A]" />
              <h4 className="mb-2 text-[#2C2C2C]">24/7 Support</h4>
              <p className="text-sm text-gray-600">Dedicated support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="mb-2 text-[#2C2C2C] text-3xl font-bold">Featured Spices and Herbs</h2>
              <p className="text-gray-600">Our most popular</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => onNavigate('products')}
              className="text-[#99582A] hover:text-[#99582A] hover:bg-[#FFE6A7]"
            >
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div>
            {loadingProducts ? (
              // Show skeletons while loading featured products
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              //  Show featured products once loaded
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={(id) => onNavigate('product', { id })}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              // empty state
              <div className="text-center py-12 text-gray-500">
                No featured products available.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-[#F0F0F0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-2 text-[#2C2C2C] text-3xl font-bold">Shop by Category</h2>
            <p className="text-gray-600">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onNavigate('products', { categoryId: category.id })}
                className="group relative overflow-hidden rounded-lg aspect-[4/5] bg-white hover:shadow-lg transition-shadow"
              >
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white mb-1 font-semibold">{category.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-2 text-[#2C2C2C] text-3xl font-bold">Spice blends</h2>
            <p className="text-gray-600">Check out our latest additions</p>
          </div>
          <div>
            {loadingProducts ? (
              // Show skeletons while loading featured products
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : newArrivals.length > 0 ? (
              //  Show featured products once loaded
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={(id) => onNavigate('product', { id })}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              // empty state
              <div className="text-center py-12 text-gray-500">
                No new products available.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-[#99582A]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="mb-4 text-white text-3xl font-bold">Limited Time Offer</h2>
          <p className="mb-6 text-white/90 text-lg">
            Get 20% off on selected items. Use code WELCOME20 at checkout.
          </p>
          <Link to={"/products"}>
            <Button
              variant="ghost"
              className="bg-[#F0F0F0]  p-2 hover:bg-[#FFE6A7]"
            >
              Shop Sale Items
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-2 text-[#2C2C2C] text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-gray-600">Reviews from our customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < testimonial.rating ? 'text-[#99582A]' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-4 text-[#2C2C2C]">{testimonial.text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#2C2C2C] font-semibold">{testimonial.name}</span>
                  <span className="text-sm text-gray-600">{testimonial.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}

export default LandingPage;