import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-green-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold">
        AloePure
      </Link>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-green-300 transition duration-200">
          Home
        </Link>
        <Link to="/about" className="hover:text-green-300 transition duration-200">
          About
        </Link>
        <Link to="/products" className="hover:text-green-300 transition duration-200">
          Products
        </Link>
        <Link to="/contact" className="hover:text-green-300 transition duration-200">
          Contact
        </Link>
        <Link to="/cart" className="relative hover:text-green-300 transition duration-200">
          Cart
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}