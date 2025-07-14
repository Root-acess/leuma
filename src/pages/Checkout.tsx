import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with test publishable key (replace with your own for production)
const stripePromise = loadStripe('pk_test_51J...'); // Get from Stripe Dashboard

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  sameAsBilling: boolean;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
}

export default function Checkout() {
  const { cartItems, removeItem } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'upi'>('stripe');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      sameAsBilling: true,
    },
  });
  const sameAsBilling = watch('sameAsBilling');

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Current date and time (Saturday, June 14, 2025, 10:27 PM IST)
  const orderDateTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    setIsProcessing(true);
    try {
      if (paymentMethod === 'stripe') {
        // Stripe Payment Flow
        const response = await fetch('http://localhost:3001/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(totalPrice * 100), // Stripe expects amount in cents
            currency: 'inr',
            metadata: {
              orderDateTime, // Include current date and time
              orderDetails: JSON.stringify({
                billing: {
                  name: `${data.firstName} ${data.lastName}`,
                  email: data.email,
                  address: data.address,
                  city: data.city,
                  postalCode: data.postalCode,
                  country: data.country,
                  phone: data.phone,
                },
                shipping: data.sameAsBilling
                  ? null
                  : {
                      address: data.shippingAddress,
                      city: data.shippingCity,
                      postalCode: data.shippingPostalCode,
                      country: data.shippingCountry,
                    },
                items: cartItems,
              }),
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create payment intent: ${errorText} (Status: ${response.status})`);
        }

        const { clientSecret } = await response.json();
        const stripe = await stripePromise;

        if (!stripe) throw new Error('Stripe failed to initialize');

        const result = await stripe.redirectToCheckout({ sessionId: clientSecret });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        // UPI Payment Flow (via PayU Money or similar gateway)
        const response = await fetch('http://localhost:3001/api/create-upi-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalPrice,
            currency: 'INR',
            firstname: data.firstName,
            email: data.email,
            phone: data.phone,
            productinfo: 'AloePure Order',
            txnid: `txn_${Date.now()}`,
            metadata: {
              orderDateTime, // Include current date and time
              orderDetails: JSON.stringify({
                billing: {
                  name: `${data.firstName} ${data.lastName}`,
                  email: data.email,
                  address: data.address,
                  city: data.city,
                  postalCode: data.postalCode,
                  country: data.country,
                  phone: data.phone,
                },
                shipping: data.sameAsBilling
                  ? null
                  : {
                      address: data.shippingAddress,
                      city: data.shippingCity,
                      postalCode: data.shippingPostalCode,
                      country: data.shippingCountry,
                    },
                items: cartItems,
              }),
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to initiate UPI payment: ${errorText} (Status: ${response.status})`);
        }

        const { paymentUrl } = await response.json();
        window.location.href = paymentUrl; // Redirect to UPI payment page
      }
    } catch (error) {
      console.error('Payment Error:', error); // Log the error for debugging
      toast.error(`Payment failed: ${error.message || 'Something went wrong'}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 animate-fade-in">
            Your Cart is Empty
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Browse our{' '}
            <Link to="/products" className="text-green-600 underline hover:text-green-700">
              products
            </Link>{' '}
            to add items to your cart.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-transform transform hover:scale-105 duration-300"
          >
            Shop Now
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8 flex justify-center space-x-4">
          <div className="flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full">1</span>
            <span className="ml-2 text-green-600 font-medium">Cart</span>
          </div>
          <div className="flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full">2</span>
            <span className="ml-2 text-green-600 font-medium">Checkout</span>
          </div>
          <div className="flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-gray-300 text-gray-600 rounded-full">3</span>
            <span className="ml-2 text-gray-600 font-medium">Confirmation</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-8 text-center animate-fade-in">
          Secure Checkout
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Billing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="relative mt-1">
                  <input
                    id="firstName"
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } pl-10`}
                    aria-invalid={errors.firstName ? 'true' : 'false'}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="relative mt-1">
                  <input
                    id="lastName"
                    type="text"
                    {...register('lastName', { required: 'Last name is required' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } pl-10`}
                    aria-invalid={errors.lastName ? 'true' : 'false'}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1">
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } pl-10`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12h4m-4 0H4m0 0l8-8m-8 8l8 8" />
                </svg>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="relative mt-1">
                <input
                  id="address"
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } pl-10`}
                  aria-invalid={errors.address ? 'true' : 'false'}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5z" />
                </svg>
              </div>
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="relative mt-1">
                  <input
                    id="city"
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } pl-10`}
                    aria-invalid={errors.city ? 'true' : 'false'}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5z" />
                  </svg>
                </div>
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <div className="relative mt-1">
                  <input
                    id="postalCode"
                    type="text"
                    {...register('postalCode', { required: 'Postal code is required' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    } pl-10`}
                    aria-invalid={errors.postalCode ? 'true' : 'false'}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5z" />
                  </svg>
                </div>
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                )}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="relative mt-1">
                <input
                  id="country"
                  type="text"
                  {...register('country', { required: 'Country is required' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  } pl-10`}
                  aria-invalid={errors.country ? 'true' : 'false'}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5z" />
                </svg>
              </div>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative mt-1">
                <input
                  id="phone"
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: 'Invalid phone number',
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } pl-10`}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Shipping Details */}
            <div className="flex items-center mb-6">
              <input
                id="sameAsBilling"
                type="checkbox"
                {...register('sameAsBilling')}
                className="h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
              />
              <label htmlFor="sameAsBilling" className="ml-2 text-sm text-gray-700">
                Shipping address same as billing
              </label>
            </div>

            {!sameAsBilling && (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5z" />
                  </svg>
                  Shipping Details
                </h2>
                <div className="mb-6">
                  <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="shippingAddress"
                      type="text"
                      {...register('shippingAddress', { required: 'Shipping address is required' })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                        errors.shippingAddress ? 'border-red-500' : 'border-gray-300'
                      } pl-10`}
                      aria-invalid={errors.shippingAddress ? 'true' : 'false'}
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5z" />
                    </svg>
                  </div>
                  {errors.shippingAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="relative mt-1">
                      <input
                        id="shippingCity"
                        type="text"
                        {...register('shippingCity', { required: 'Shipping city is required' })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                          errors.shippingCity ? 'border-red-500' : 'border-gray-300'
                        } pl-10`}
                        aria-invalid={errors.shippingCity ? 'true' : 'false'}
                      />
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5z" />
                      </svg>
                    </div>
                    {errors.shippingCity && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingCity.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="shippingPostalCode" className="block text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <div className="relative mt-1">
                      <input
                        id="shippingPostalCode"
                        type="text"
                        {...register('shippingPostalCode', { required: 'Shipping postal code is required' })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                          errors.shippingPostalCode ? 'border-red-500' : 'border-gray-300'
                        } pl-10`}
                        aria-invalid={errors.shippingPostalCode ? 'true' : 'false'}
                      />
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5z" />
                      </svg>
                    </div>
                    {errors.shippingPostalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingPostalCode.message}</p>
                    )}
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="shippingCountry" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="shippingCountry"
                      type="text"
                      {...register('shippingCountry', { required: 'Shipping country is required' })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                        errors.shippingCountry ? 'border-red-500' : 'border-gray-300'
                      } pl-10`}
                      aria-invalid={errors.shippingCountry ? 'true' : 'false'}
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5z" />
                    </svg>
                  </div>
                  {errors.shippingCountry && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingCountry.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Payment Method Selection */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-transform transform hover:scale-105 duration-300 ${
                  paymentMethod === 'stripe'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Credit/Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-transform transform hover:scale-105 duration-300 ${
                  paymentMethod === 'upi'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-2.21-1.79-4-4-4S4 8.79 4 11m16 0c0-2.21-1.79-4-4-4s-4 1.79-4 4m-4 4c0 2.21 1.79 4 4 4s4-1.79 4-4m-4-4v8" />
                </svg>
                UPI (Google Pay, PhonePe, etc.)
              </button>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full px-6 py-3 bg-green-600 text-white rounded-full font-semibold transition-transform transform hover:scale-105 duration-300 ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay ₹${totalPrice.toFixed(2)}`
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-xl shadow-lg lg:sticky lg:top-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Order Summary
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-green-600 text-sm">₹{item.price.toFixed(2)}</p>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    <div className="flex text-yellow-400 text-xs mt-1">
                      {'★'.repeat(Math.floor(item.rating || 0))}
                      {'☆'.repeat(5 - Math.floor(item.rating || 0))}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600 transition duration-200"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <svg
                      className="w-5 h-5"
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
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-800 mt-4">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/products"
              className="block w-full mt-6 text-center text-green-600 hover:text-green-700 transition duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}