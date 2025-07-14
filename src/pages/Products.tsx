import { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'; // <-- Import Link


const dummyProducts: Product[] = [
  {
    id: 1,
    name: 'Aloe Vera Gel',
    price: 19.99,
    image: '../src/assets/images/img1.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Gel',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Aloe Moisturizer',
    price: 24.99,
    image: '../src/assets/images/img2.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Moisturizer',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Aloe Face Mask',
    price: 14.99,
    image: '../src/assets/images/img3.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Mask',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Aloe Body Lotion',
    price: 29.99,
    image: '../src/assets/images/img4.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Lotion',
    rating: 4.3,
  },
  {
    id: 5,
    name: 'Aloe Cleanser',
    price: 15.99,
    image: '../src/assets/images/img4.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Cleanser',
    rating: 4.0,
  },
  {
    id: 6,
    name: 'Aloe Sunscreen',
    price: 22.99,
    image: '../src/assets/images/img4.png', // <--- IMPORTANT: Adjust this path based on your project setup
    category: 'Sunscreen',
    rating: 4.6,
  },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addToCart } = useCart();

  const categories = ['All', ...new Set(dummyProducts.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    setIsLoading(true);
    let products = dummyProducts
      .filter(
        (product) =>
          selectedCategory === 'All' || product.category === selectedCategory
      )
      .filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (sortOption === 'price-low') {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      products = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setIsLoading(false);
    return products;
  }, [selectedCategory, sortOption, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category,
      rating: product.rating,
    });
    toast.success(`${product.name} added to cart!`, {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-green-100 to-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4 animate-fade-in">
          AloePure Products
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our range of natural aloe vera skincare products, crafted with care for your skin.
        </p>
      </section>

      <section className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="block"
              >
                <ProductCard
                  product={product}
                  addToCart={() => handleAddToCart(product)}
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600 mb-4">No products found.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setSortOption('default');
                }}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
