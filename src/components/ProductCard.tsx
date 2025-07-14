import { Product } from '../types';

     interface ProductCardProps {
       product: Product;
       addToCart: () => void;
     }

     export default function ProductCard({ product, addToCart }: ProductCardProps) {
       return (
         <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
           <img
             src={product.image}
             alt={product.name}
             className="w-full h-48 object-cover rounded-lg mb-4"
           />
           <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
           <p className="text-green-600 font-medium">₹{product.price.toFixed(2)}</p>
           <div className="flex text-yellow-400 mt-2">
             {'★'.repeat(Math.floor(product.rating || 0))}
             {'☆'.repeat(5 - Math.floor(product.rating || 0))}
           </div>
           <button
             onClick={addToCart}
             className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
           >
             Add to Cart
           </button>
         </div>
       );
     }