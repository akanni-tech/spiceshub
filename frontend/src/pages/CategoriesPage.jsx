import { Grid3x3, ArrowRight } from 'lucide-react';

import { useEffect, useState } from 'react';
import { getCategories } from '../hooks/services';
import { Link } from 'react-router';
import { CategoryCardSkeleton } from '../components/CategoryCardSkeleton';

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

export function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories()
      setCategories(data)
      setLoading(false)
    }
    loadCategories();
  }, [])

  console.log(categories)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#99582A] to-[#99582A]/90 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Grid3x3 className="w-12 h-12 mx-auto mb-6 text-white" />
          <h1 className="mb-4 text-white">Browse Categories</h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Explore our diverse range of spices and herbs organized by category. Find exactly what you're looking for.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Categories Grid */}
        <div className="mb-16">
          <h2 className="mb-8 text-[#2C2C2C]">All Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <CategoryCardSkeleton key={i} />
                ))
              : categories.map((category) => (
                  <Link key={category.id} to={`/products`}>
                    <button
                      className="group relative overflow-hidden rounded-lg aspect-square bg-white border border-gray-200 hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                        <h3 className="text-white mb-2">{category.name}</h3>
                        <div className="flex items-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  </Link>
                ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center bg-[#FFE6A7] rounded-lg p-8">
          <h3 className="mb-3 text-[#2C2C2C]">Can't Find What You're Looking For?</h3>
          <p className="text-[#2C2C2C]/80 mb-6 max-w-xl mx-auto">
            Use our search feature or contact our customer service team for personalized assistance.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button 
              onClick={() => onNavigate('category')}
              className="bg-[#99582A] p-2 hover:bg-[#99582A]/90"
            >
              Browse All Products
            </Button>
            <Button variant="outline" className="p-2">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}