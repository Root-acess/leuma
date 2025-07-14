import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Stripe from 'stripe';
import { createHash } from 'crypto';
import cors from 'cors';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Stripe Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;
    console.log('Order DateTime:', metadata.orderDateTime); // Log for debugging
    const paymentIntent = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      amount,
      currency,
      metadata,
    });

    res.json({ clientSecret: paymentIntent.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PayU Money UPI Payment (Placeholder)
app.post('/api/create-upi-payment', async (req, res) => {
  try {
    const { amount, currency, firstname, email, phone, productinfo, txnid, metadata } = req.body;
    console.log('Order DateTime:', metadata.orderDateTime); // Log for debugging

    // PayU Money configuration
    const payuKey = process.env.PAYU_KEY; // Use environment variable
    const payuSalt = process.env.PAYU_SALT; // Use environment variable
    const payuUrl = 'https://test.payu.in/_payment'; // Use live URL for production

    // Create hash for PayU
    const hashString = `${payuKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${payuSalt}`;
    const hash = createHash('sha512').update(hashString).digest('hex');

    // PayU payment form data
    const payuData = {
      key: payuKey,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl: 'http://localhost:3001/api/payment-success', // Success URL
      furl: 'http://localhost:3001/api/payment-failure', // Failure URL
      hash,
      service_provider: 'payu_paisa',
      payment_type: 'UPI',
    };

    res.json({ paymentUrl: `${payuUrl}?${new URLSearchParams(payuData).toString()}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PayU Success Callback (Placeholder)
app.post('/api/payment-success', (req, res) => {
  console.log('Payment Success:', req.body);
  // Validate payment, update order status, clear cart, etc.
  res.redirect('http://localhost:5173/checkout-success'); // Redirect to frontend success page
});

// PayU Failure Callback (Placeholder)
app.post('/api/payment-failure', (req, res) => {
  console.log('Payment Failure:', req.body);
  res.redirect('http://localhost:5173/checkout?error=payment_failed');
});

app.listen(3001, () => console.log('Server running on port 3001'));