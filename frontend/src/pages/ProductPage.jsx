import React, { useState, useMemo, useEffect } from 'react';
import { Star, Heart, ShoppingCart, Truck, Shield, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { mockProducts, mockReviews } from '../data/mockData';
import { Link, useLoaderData, useParams } from 'react-router';
import api from '../hooks/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { quickAddToWishlist, createReview, getUserBySupabaseId, getReviewsForProduct } from '../hooks/services';
import { useAuth } from '../authResource/useAuth';
import { toast } from 'sonner';

// Mock UI components
const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div className={className}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsList = ({ children, className, activeTab, setActiveTab }) => (
  <div className={`${className} flex justify-between`}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const TabsTrigger = ({ value, children, className, activeTab, setActiveTab }) => (
  <button
    className={`${className} ${activeTab === value ? 'border-[#99582A] !border-b-[#99582A]' : 'border-transparent'}`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, activeTab }) => {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
};

const Button = ({ children, className, onClick }) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
);

// Review Modal Component
const ReviewModal = ({ isOpen, onClose, onSubmit, productId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ productId, rating, comment });
      setRating(5);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#2C2C2C]">Write a Review</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${star <= rating ? 'fill-[#99582A] text-[#99582A]' : 'text-gray-300'
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Your Review
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#99582A] min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#99582A] hover:bg-[#99582A]/90 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export function ProductDetailPage({ onNavigate, onAddToCart }) {
  const { productId } = useParams()
  const { session } = useAuth();
  const product = useLoaderData()
  const [quantity, setQuantity] = useState(100);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPackaging, setSelectedPackaging] = useState("paper");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const relatedProducts = useMemo(() => mockProducts.filter(p => p.id !== product.id).slice(0, 4), [product]);

  // Calculate average rating from reviews
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return product.rating || 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews, product.rating]);

  const reviewCount = reviews.length;

  useEffect(() => {
    // Scroll to top when productId changes
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    async function fetchReviews() {
      if (product?.id) {
        try {
          setReviewsLoading(true);
          const reviewsData = await getReviewsForProduct(product.id);
          setReviews(reviewsData);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          setReviews([]);
        } finally {
          setReviewsLoading(false);
        }
      }
    }

    fetchReviews();
  }, [product?.id]);


  const { refreshCart, addItem } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const addToCart = async (productId) => {
    const payload = {
      user_id: session.user.id, //default user for now
      items: [{ product_id: productId, container: selectedPackaging, quantity: quantity }]
    }
    const response = await api.post(`/carts/carts`, payload);
    await refreshCart()
    toast.success("added to cart")
    return response.data
  }

  const handleToggleWishlist = async (id) => {
    if (isInWishlist(id)) {
      // Find the item id
      const item = wishlist?.items?.find(item => item.product.id === id);
      if (item) {
        await removeFromWishlist(item.id);
        toast.success("removed from wishlist")
      }
    } else {
      await addToWishlist(id);
      toast.success("added to wishlist")
    }
  };

  const handleSubmitReview = async ({ productId, rating, comment }) => {
    if (!session?.user?.id) {
      toast.error("Please log in to write a review");
      return;
    }

    try {
      // Get the database user ID
      const dbUser = await getUserBySupabaseId(session.user.id);

      const reviewData = {
        product_id: productId,
        user_id: dbUser.id,
        rating: rating,
        comment: comment
      };

      await createReview(reviewData);
      toast.success("Review submitted successfully!");

      // Refresh reviews
      const updatedReviews = await getReviewsForProduct(productId);
      setReviews(updatedReviews);
    } catch (error) {
      toast.error("Failed to submit review");
      throw error;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => onNavigate('home')} className="hover:text-[#99582A]">Home</button>
        <span>/</span>
        <Link to={'/products'} className="hover:text-[#99582A]">
          Products
        </Link>
        <span>/</span>
        <span className="text-[#2C2C2C]">{product.name}</span>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image gallery */}
        <div>
          <div className="mb-4 rounded-lg overflow-hidden bg-[#F0F0F0] aspect-square">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images && product.images.map((img, idx) => (
              <button key={idx} onClick={() => setSelectedImage(idx)}
                className={`rounded-lg overflow-hidden aspect-square ${selectedImage === idx ? 'ring-2 ring-[#99582A]' : ''}`}>
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4 flex gap-2">
            {product.isNew && <span className="px-2 py-1 bg-[#99582A] text-white text-xs rounded">New Arrival</span>}
            {product.isSale && <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">On Sale</span>}
          </div>
          <h1 className="mb-4 text-[#2C2C2C]">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'fill-[#99582A] text-[#99582A]' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{averageRating.toFixed(1)} ({reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-[#99582A]">ksh {(product.price).toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-muted-foreground text-gray-400 line-through">ksh {(product.originalPrice).toFixed(2)}</span>
            )}
          </div>

          <p className='mb-6 text-sm'>{product.short_description}</p>

          {/* Packaging selector */}
          <div className="mb-6">
            <label className="block mb-3 text-[#2C2C2C]">Packaging</label>
            <div className="flex gap-2">
              {product.containers.map(packaging => (
                <button key={packaging} onClick={() => setSelectedPackaging(packaging)}
                  className={`px-4 py-2 border border-gray-400 rounded ${selectedPackaging === packaging ? 'border-[#99582A] bg-[#FFE6A7] text-[#2C2C2C]' : 'border-border hover:border-[#99582A]'}`}>
                  {packaging}
                </button>
              ))}
            </div>
            <p className='text-red-500/70 text-sm pt-2'>* Extra cost applies for Plastic @ksh 50 and glass containers @ksh 100</p>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block mb-3 text-[#2C2C2C]">Quantity in grams</label>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50" onClick={() => setQuantity(Math.max(100, quantity - 100))}>-</button>
              <span className="w-8 text-center">{quantity}</span>
              <button className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50" onClick={() => setQuantity(quantity + 100)}>+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <button onClick={() => addToCart(product.id)} className="flex-1 bg-[#99582A] hover:bg-[#99582A]/90 text-white px-4 py-2 rounded flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </button>
            <button
              onClick={() => handleToggleWishlist(product.id)}
              className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center">
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
            </button>
          </div>

          {/* Info cards */}
          <div className="space-y-3 pt-6 border-t border-gray-400">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-5 h-5 text-[#99582A]" />
              <span className="text-[#2C2C2C]">Free shipping on orders in CBD and Kasarani</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full  border-b border-gray-400 rounded-none h-auto  bg-transparent">
            <TabsTrigger
              value="description"
              className="rounded-none p-1 w-full border"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none p-1 w-full border"
            >
              Reviews ({reviewCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose mt-6 max-w-none">
              <p className="text-[#2C2C2C]/80 mb-4">
                {product.description}
              </p>
              <h3 className="text-[#2C2C2C] mb-3">Key Features:</h3>
              <ul className="space-y-2 text-[#2C2C2C]/80">
                <li>Premium quality </li>

              </ul>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6 mt-6">
              {/* Rating Summary */}
              <div className="flex items-start justify-center gap-8 pb-6 border-b border-gray-400">
                <div className="flex flex-col items-center">
                  <div className="mb-2 text-[#99582A]">Product rating: {averageRating.toFixed(1)}</div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(averageRating)
                          ? 'fill-[#99582A] text-[#99582A]'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground text-gray-500">
                    Based on {reviewCount} reviews
                  </p>
                </div>
                <Button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-[#99582A] p-5 rounded-xl hover:bg-[#99582A]/90"
                >
                  Write a Review
                </Button>
              </div>

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet. Be the first to write a review!</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="pb-6 border-b border-gray-400 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#2C2C2C]">{review.user?.firstName} {review.user?.lastName}</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Verified Purchase</span>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-[#99582A] text-[#99582A]' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#2C2C2C]/80">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <section>
        {/* <h2 className="mb-8 text-[#2C2C2C]">You Might Also Like</h2> */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {/* {relatedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={(id) => onNavigate('product', { id })}
              onAddToCart={onAddToCart}
            />
          ))} */}
        </div>
      </section>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
        productId={product.id}
      />
    </div>
  );
}

export default ProductDetailPage;