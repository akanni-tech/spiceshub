from fastapi import APIRouter

from .user import router as user_router
from .products import router as product_router
from .cart import router as cart_router
from .wishlist import router as wishlist_router
from .order import router as order_router
from .review import router as review_router
from .shipping import router as shipping_router
from .guest_cart import router as guest_cart_router
from .guest_wishlist_routes import router as guest_wishlist_router
from .category import router as category_router
from .meal import router as meal_router
from .health import router as health_router
from .sale import router as sale_router

api_router = APIRouter()

# Include all routers
api_router.include_router(user_router, prefix="/users", tags=["Users"])
api_router.include_router(product_router, prefix="/products", tags=["Products"])
api_router.include_router(cart_router, prefix="/carts", tags=["Carts"])
api_router.include_router(wishlist_router, prefix="/wishlists", tags=["Wishlists"])
api_router.include_router(order_router, prefix="/orders", tags=["Orders"])
api_router.include_router(review_router, prefix="/reviews", tags=["Reviews"])
api_router.include_router(shipping_router, prefix="/shippingAddresses", tags=["Addresses"])
api_router.include_router(guest_cart_router, prefix="/guest", tags=["Guest Cart"])
api_router.include_router(guest_wishlist_router, prefix="/guest", tags=["Guest Wishlist"])
api_router.include_router(category_router, prefix="/category", tags=["Categories"])
api_router.include_router(meal_router, prefix="/meals", tags=["Meals"])
api_router.include_router(health_router, prefix="/health", tags=["Health"])
api_router.include_router(sale_router, prefix="/sales", tags=["Sales"])