import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';

export default function CheckoutSuccess() {
  const { cartItems, setCartItems } = useCart();

  useEffect(() => {
    // Clear cart after successful payment
    if (cartItems.length > 0) {
      setCartItems([]);
    }
  }, [cartItems, setCartItems]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 animate-fade-in">
          Thank You for Your Order!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your order has been successfully placed. You'll receive a confirmation email shortly.
        </p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition duration-300"
        >
          Continue Shopping
        </Link>
      </section>
      <Footer />
    </div>
  );
}