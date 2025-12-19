import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './layout/Layout';


function App() {


  return (
    <>
      <WishlistProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </WishlistProvider>
    </>
  )
}

export default App