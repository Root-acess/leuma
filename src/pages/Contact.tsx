import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <>
      <Navbar />
      <section className="py-12 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Get in Touch</h1>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-3 border rounded" />
          <input type="email" placeholder="Your Email" className="w-full p-3 border rounded" />
          <textarea placeholder="Message" className="w-full p-3 border rounded h-32" />
          <button className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600">
            Send Message
          </button>
        </form>
      </section>
      <Footer />
    </>
  );
}