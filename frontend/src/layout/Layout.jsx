import React, { useEffect, useState } from 'react'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from 'react-router'
import ProductDetailPage from '../pages/ProductPage'
import CategoryPage from '../pages/ProductsPage'
import LandingPage from '../pages/LandingPage'
import CartPage from '../pages/CartPage'
import { CategoriesPage } from '../pages/CategoriesPage'
import SalePage from '../pages/SalePage'
import ProfilePage from '../pages/ProfilePage'
import WishlistPage from '../pages/WishlistPage'
import AccountPage from '../pages/AccountPage'
import ScrollToTop from '../components/ScrollToTop'
import MainLayout from './MainLayout'
import { getCartItems, getSingleProduct, getSingleCategory } from '../hooks/services'
import CheckoutPage from '../pages/CheckoutPage'
import TrackOrderPage from '../pages/TrackOrderPage'
import AdminSidebar from '../admin/AdminSidebar'
import OrderConfirmationPage from '../pages/OrderConfirmationPage'
import { SignUpPage } from '../pages/auth/SignUpPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage'
import { SSOPage } from '../pages/auth/SSOPage'
import ValuePacksPage from '../pages/ValuePacksPage'
import SmartShopPage from '../pages/SmartShopPage'


const Layout = () => {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/products' element={<CategoryPage />} />
          <Route path='/value-packs' element={<ValuePacksPage />} />
          <Route path='/category' element={<CategoriesPage />} />
          <Route path='/sale' element={<SalePage />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/wishlist' element={<WishlistPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/smart-shop' element={<SmartShopPage />} />
          <Route path='/track-order' element={<TrackOrderPage />} />
          <Route path='/product/:productId' element={<ProductDetailPage />} loader={getSingleProduct} />
          <Route path='/confirmOrder' element={<OrderConfirmationPage />} />
        </Route>

        <Route path='/admin' element={<AdminSidebar />} />
        <Route path='/signup' element={< SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/sso' element={<SSOPage />} />
      </>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default Layout