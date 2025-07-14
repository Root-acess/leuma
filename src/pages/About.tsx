import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-green-100 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-6 animate-fade-in">
            About AloePure
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            AloePure is committed to delivering premium natural skincare products made with 100% organic aloe vera. 
            Founded with the goal of promoting sustainable beauty, we blend tradition with modern science to create 
            products that heal, soothe, and rejuvenate. Our aloe soaps are handmade, cruelty-free, and infused with 
            essential oils for a refreshing bath experience.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            At AloePure, we strive to harness the healing power of nature to create skincare that’s safe, sustainable, 
            and effective. We believe in transparency, eco-friendly practices, and delivering products that make you 
            feel good inside and out.
          </p>
          <div className="mt-8 flex justify-center">
            <img
              src="https://via.placeholder.com/600x400/ace1af/ffffff?text=Aloe+Fields"
              alt="Aloe Fields"
              className="rounded-xl shadow-lg max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Our Journey
        </h2>
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-600"></div>
          {[
            {
              year: '2018',
              title: 'Founded AloePure',
              desc: 'Started with a vision to bring natural skincare to every home.',
            },
            {
              year: '2020',
              title: 'First Product Launch',
              desc: 'Introduced our signature Aloe Defense Gel and Classic Aloe Soap.',
            },
            {
              year: '2023',
              title: 'Sustainable Packaging',
              desc: 'Transitioned to 100% biodegradable packaging.',
            },
            {
              year: '2025',
              title: 'Global Reach',
              desc: 'Expanded our reach to international markets with eco-friendly shipping.',
            },
          ].map((milestone, index) => (
            <div
              key={index}
              className={`flex items-center mb-12 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className="w-1/2 px-6">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">{milestone.year}</h3>
                  <h4 className="text-lg font-medium text-green-600 mt-2">{milestone.title}</h4>
                  <p className="text-gray-600 mt-2">{milestone.desc}</p>
                </div>
              </div>
              <div className="w-1/2"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: 'Anita Sharma',
              role: 'Founder & CEO',
              image: 'https://via.placeholder.com/300x300/ace1af/000?text=Founder',
            },
            {
              name: 'Rahul Verma',
              role: 'Head of Product',
              image: 'https://via.placeholder.com/300x300/98fb98/000?text=Product+Head',
            },
            {
              name: 'Priya Desai',
              role: 'Sustainability Lead',
              image: 'https://via.placeholder.com/300x300/fdfd96/000?text=Sustainability+Lead',
            },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-8 bg-green-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Join the AloePure Family
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Experience the power of nature with our handcrafted aloe products. Shop now and discover the difference!
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
        >
          Shop Now
        </Link>
      </section>

      <Footer />
    </div>
  );
}