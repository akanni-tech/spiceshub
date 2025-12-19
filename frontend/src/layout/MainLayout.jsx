import React, { useEffect, useState } from 'react'
import {Outlet } from 'react-router'
import Header from '../components/Header'
import { Toaster } from 'sonner'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { getCartItems } from '../hooks/services'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const MainLayout = () => {
  const {cartItemCount} = useCart()
  const {wishlistCount} = useWishlist()

  return (
    <>
      <Header cartItemCount={cartItemCount} wishListItemCount={wishlistCount} />
      <ScrollToTop />
      <Outlet />
      <Footer />
      <Toaster richColors />
    </>
  )
}

export default MainLayout