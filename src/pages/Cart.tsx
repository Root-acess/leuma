import Navbar from '../components/Navbar';
   import Footer from '../components/Footer';
   import { Link } from 'react-router-dom';
   import { useCart } from '../context/CartContext';

   export default function Cart() {
     const { cartItems, updateQuantity, removeItem } = useCart();

     // Calculate total price
     const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

     return (
       <div className="min-h-screen flex flex-col bg-gray-50">
         <Navbar />

         {/* Cart Section */}
         <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
           <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-8 text-center">
             Shopping Cart
           </h1>

           {cartItems.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-lg text-gray-600 mb-6">
                 Your cart is currently empty. Browse our{' '}
                 <Link to="/products" className="text-green-600 underline hover:text-green-700">
                   products
                 </Link>{' '}
                 to add items.
               </p>
               <Link
                 to="/products"
                 className="inline-block px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition duration-300"
               >
                 Shop Now
               </Link>
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Cart Items */}
               <div className="lg:col-span-2">
                 {cartItems.map((item) => (
                   <div
                     key={item.id}
                     className="flex items-center bg-white p-6 mb-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                   >
                     <img
                       src={item.image}
                       alt={item.title}
                       className="w-24 h-24 object-cover rounded-lg mr-6"
                     />
                     <div className="flex-1">
                       <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                       <p className="text-green-600 font-medium">₹{item.price.toFixed(2)}</p>
                       <div className="flex text-yellow-400 mt-2">
                         {'★'.repeat(Math.floor(item.rating || 0))}
                         {'☆'.repeat(5 - Math.floor(item.rating || 0))}
                       </div>
                       <div className="flex items-center mt-2">
                         <button
                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
                           className="px-3 py-1 bg-gray-200 text-gray-800 rounded-l-lg hover:bg-gray-300 transition duration-200"
                           disabled={item.quantity === 1}
                         >
                           -
                         </button>
                         <span className="px-4 py-1 bg-gray-100 text-gray-800">{item.quantity}</span>
                         <button
                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
                           className="px-3 py-1 bg-gray-200 text-gray-800 rounded-r-lg hover:bg-gray-300 transition duration-200"
                         >
                           +
                         </button>
                       </div>
                     </div>
                     <button
                       onClick={() => removeItem(item.id)}
                       className="text-red-500 hover:text-red-600 transition duration-200"
                     >
                       <svg
                         className="w-6 h-6"
                         fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg"
                       >
                         <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth="2"
                           d="M6 18L18 6M6 6l12 12"
                         />
                       </svg>
                     </button>
                   </div>
                 ))}
               </div>

               {/* Cart Summary */}
               <div className="bg-white p-6 rounded-xl shadow-md">
                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                 <div className="flex justify-between text-gray-600 mb-2">
                   <span>Subtotal</span>
                   <span>₹{totalPrice.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-gray-600 mb-2">
                   <span>Shipping</span>
                   <span>Free</span>
                 </div>
                 <div className="flex justify-between text-lg font-semibold text-gray-800 mt-4 pt-4 border-t">
                   <span>Total</span>
                   <span>₹{totalPrice.toFixed(2)}</span>
                 </div>
                 <Link
                   to="/checkout"
                   className="block w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-full text-center font-semibold hover:bg-green-700 transition duration-300"
                 >
                   Proceed to Checkout
                 </Link>
                 <Link
                   to="/products"
                   className="block w-full mt-4 text-center text-green-600 hover:text-green-700 transition duration-200"
                 >
                   Continue Shopping
                 </Link>
               </div>
             </div>
           )}
         </section>

         <Footer />
       </div>
     );
   }