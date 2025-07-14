import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

/** Helper to resolve images in /src/assets/images/ */
const img = (file: string) =>
  new URL(`../assets/images/${file}`, import.meta.url).href;

/* ────────────────────────────────────────────────────────────────── */
/* Banner slides                                                     */
/* ────────────────────────────────────────────────────────────────── */
const sliderImages = [
  { image: img('bg1.jpg'), title: 'Flawless Glow', subtitle: 'Discover the power of natural aloe' },
  { image: img('bg2.jpg'), title: 'Natural Care',  subtitle: 'Gentle care for your skin' },
  { image: img('bg3.jpg'), title: 'Aloe Goodness', subtitle: 'Purely natural, purely you' },
];

/* ────────────────────────────────────────────────────────────────── */
/* Product cards                                                     */
/* ────────────────────────────────────────────────────────────────── */
const sliderProducts: Product[] = [
  { id: 1, name: 'Aloe Vera Gel',   price: 19.99, image: img('img1.png'), category: 'Gel',        rating: 4.5 },
  { id: 2, name: 'Aloe Moisturizer', price: 24.99, image: img('img2.png'), category: 'Moisturizer', rating: 4.2 },
  { id: 3, name: 'Aloe Face Mask',   price: 14.99, image: img('img3.png'), category: 'Mask',       rating: 4.7 },
  { id: 4, name: 'Aloe Body Lotion', price: 29.99, image: img('img4.png'), category: 'Lotion',     rating: 4.3 },
  { id: 5, name: 'Aloe Cleanser',    price: 15.99, image: img('img4.png'), category: 'Cleanser',   rating: 4.0 },
  { id: 6, name: 'Aloe Sunscreen',   price: 22.99, image: img('img4.png'), category: 'Sunscreen',  rating: 4.6 },
];

/* ────────────────────────────────────────────────────────────────── */
/* Featured category blocks                                          */
/* ────────────────────────────────────────────────────────────────── */
const featuredCategories = [
  { name: 'Classic Aloe',   color: '#d1fae5', textColor: '#065f46' },
  { name: 'Neem & Aloe',    color: '#bbf7d0', textColor: '#15803d' },
  { name: 'Turmeric Aloe',  color: '#fef9c3', textColor: '#92400e' },
  { name: 'Charcoal Aloe',  color: '#e5e7eb', textColor: '#1f2937' },
];

/* ────────────────────────────────────────────────────────────────── */
/* Brand benefits                                                    */
/* ────────────────────────────────────────────────────────────────── */
const benefits = [
  {
    icon: 'Natural',
    title: '100% Natural',
    desc: 'No chemicals, no harsh elements. Just nature’s purity.',
    color: '#bbf7d0',
    textColor: '#065f46',
  },
  {
    icon: 'Eco',
    title: 'Eco‑Friendly',
    desc: 'Sustainable practices and biodegradable packaging.',
    color: '#f0fdf4',
    textColor: '#065f46',
  },
  {
    icon: 'Skin Safe',
    title: 'Gentle on Skin',
    desc: 'Safe for all skin types including sensitive skin.',
    color: '#e0f2fe',
    textColor: '#0284c7',
  },
];

/* ────────────────────────────────────────────────────────────────── */
/* Customer reviews                                                  */
/* ────────────────────────────────────────────────────────────────── */
const reviews = [
  { text: 'The best soap I’ve ever used! So gentle and smells amazing.', author: 'Ritu, Delhi' },
  { text: 'I love the neem variant. My skin feels fresh and acne has reduced.', author: 'Anil, Bangalore' },
];

/* ────────────────────────────────────────────────────────────────── */
/* Page component                                                    */
/* ────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();

  /* Banner auto‑advance */
  useEffect(() => {
    const id = setInterval(
      () => setCurrentSlide(i => (i + 1) % sliderImages.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  /* Add‑to‑cart handler */
  const handleAddToCart = (p: Product) => {
    addToCart({
      id: p.id,
      title: p.name,
      price: p.price,
      image: p.image,
      quantity: 1,
      category: p.category,
      rating: p.rating,
    });
    toast.success(`${p.name} added to cart!`, {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ───────────── Banner / Hero ───────────── */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        {sliderImages.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === i ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center px-4">
              <h1 className="text-white text-4xl md:text-6xl font-extrabold drop-shadow-lg">
                {s.title}
              </h1>
              <p className="text-white text-lg md:text-2xl mt-4 font-light drop-shadow-md">
                {s.subtitle}
              </p>
              <Link
                to="/products"
                className="mt-6 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ───────────── New Launches ───────────── */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          New Launches
        </h2>
        <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300">
          {sliderProducts.map(p => (
            <div
              key={p.id}
              className="min-w-[250px] max-w-[300px] bg-white rounded-xl shadow-lg p-6 snap-center hover:scale-105 transition-transform duration-300"
            >
              <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-lg" />
              <h3 className="text-xl font-semibold mt-4 text-gray-800">{p.name}</h3>
              <p className="text-lg font-medium text-green-600">₹{p.price.toFixed(2)}</p>
              <div className="flex text-yellow-400 mt-2">
                {'★'.repeat(Math.floor(p.rating || 0))}
                {'☆'.repeat(5 - Math.floor(p.rating || 0))}
              </div>
              <button
                onClick={() => handleAddToCart(p)}
                className="mt-4 block text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Featured Categories ───────────── */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {featuredCategories.map((c, i) => (
            <div
              key={i}
              className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <svg width="100%" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="200" fill={c.color} />
                <text
                  x="50%" y="50%"
                  dominantBaseline="middle" textAnchor="middle"
                  fontSize="20" fill={c.textColor} className="font-bold"
                >
                  {c.name}
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition">
                <Link
                  to="/products"
                  className="px-4 py-2 bg-green-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  Explore
                </Link>
              </div>
              <p className="text-center mt-4 text-lg font-semibold text-gray-800">
                {c.name} Soap
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Why Shop with Us ───────────── */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Why Shop with AloePure?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                <circle cx="50" cy="50" r="50" fill={b.color} />
                <text
                  x="50%" y="50%"
                  dominantBaseline="middle" textAnchor="middle"
                  fontSize="12" fill={b.textColor} className="font-semibold"
                >
                  {b.icon}
                </text>
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{b.title}</h3>
              <p className="text-gray-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Customer Reviews ───────────── */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Customer Reviews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-gray-600 italic mb-4">“{r.text}”</p>
              <p className="text-gray-800 font-semibold">{r.author}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
