import { dummyProducts } from '../data/dummyProducts';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);
  const { addToCart } = useCart();

  const product = dummyProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex justify-center items-center text-center">
          <p className="text-xl text-gray-700">Product not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const images = [product.image, product.image, product.image];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      category: product.category,
      rating: product.rating,
    });
    toast.success(`${product.name} added to cart!`, {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const [showDescription, setShowDescription] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="flex flex-col gap-6">
          <div className="w-full rounded-lg overflow-hidden shadow">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full object-cover"
            />
          </div>
          <div className="flex gap-4">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumb ${index + 1}`}
                className={`h-20 w-20 object-cover rounded cursor-pointer border ${
                  selectedImage === img ? 'border-black' : 'border-gray-200'
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 text-lg">{product.category}</p>

          <div className="flex items-center gap-3 text-2xl font-semibold text-green-600">
            ₹ {product.price.toFixed(2)}
          </div>

          <div className="flex items-center gap-2 text-yellow-500">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
            <span className="text-gray-600 text-sm">(Rating {product.rating})</span>
          </div>

          {/* Collapsible Description */}
          <div className="border-t pt-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowDescription(!showDescription)}
            >
              <h3 className="text-xl font-medium">Description</h3>
              {showDescription ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                showDescription ? 'max-h-96 mt-2' : 'max-h-0'
              }`}
            >
              <p className="text-gray-700 leading-relaxed">
                Pamper your skin with our handcrafted natural soap, made with pure ingredients to leave your skin feeling soft, nourished, and refreshed. Luxurious lather with calming natural scents.
              </p>
            </div>
          </div>

          {/* Collapsible Benefits */}
          <div className="border-t pt-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowBenefits(!showBenefits)}
            >
              <h3 className="text-xl font-medium">Benefits</h3>
              {showBenefits ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                showBenefits ? 'max-h-96 mt-2' : 'max-h-0'
              }`}
            >
              <ul className="text-gray-700 list-disc list-inside space-y-1 leading-relaxed">
                <li>Gentle on sensitive skin</li>
                <li>Infused with essential oils</li>
                <li>Free from parabens & sulfates</li>
                <li>Handmade with natural ingredients</li>
                <li>Provides deep nourishment & glow</li>
              </ul>
            </div>
          </div>

          {/* Collapsible Ingredients */}
          <div className="border-t pt-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowIngredients(!showIngredients)}
            >
              <h3 className="text-xl font-medium">Ingredients</h3>
              {showIngredients ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                showIngredients ? 'max-h-96 mt-2' : 'max-h-0'
              }`}
            >
              <p className="text-gray-700 leading-relaxed">
                Coconut oil, Olive oil, Shea butter, Essential oils (Lavender, Tea Tree), Aloe Vera extract, Natural botanicals.
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-3">
              <span className="font-medium text-lg">Quantity:</span>
              <div className="flex items-center gap-2 border rounded px-3 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-xl px-2"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-xl px-2"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-4 rounded-lg transition-all duration-300 mt-4"
          >
            Add to Cart
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
