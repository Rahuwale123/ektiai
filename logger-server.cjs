const express = require('express');
require('dotenv').config({ path: '.env' });
const app = express();
const port = 3001;

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'sandbox';
const CASHFREE_BASE = CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com'
  : 'https://sandbox.cashfree.com';

// Manual CORS middleware since 'cors' package is not installed
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

app.post('/log', (req, res) => {
  const { message, type = 'info', context = 'APP' } = req.body;
  const timestamp = new Date().toLocaleTimeString();
  
  const colors = {
    info: '\x1b[36m', // Cyan
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    gemini: '\x1b[35m', // Magenta
    reset: '\x1b[0m'
  };

  const color = colors[type] || colors.info;
  const tag = `[${context}]`.padEnd(10);
  
  console.log(`${timestamp} ${color}${tag}${colors.reset} ${message}`);
  res.sendStatus(200);
});

// ── Cashfree: Create Order ──────────────────────────────────────────────────
app.post('/api/create-order', async (req, res) => {
  try {
    const { userId, userEmail, userName, amount = 15 } = req.body;
    if (!userId || !userEmail) {
      return res.status(400).json({ error: 'userId and userEmail are required' });
    }

    const orderId = `ekti_${userId.slice(0, 8)}_${Date.now()}`;

    const response = await fetch(`${CASHFREE_BASE}/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: userId.slice(0, 50),
          customer_email: userEmail,
          customer_name: userName || 'User',
          customer_phone: '9999999999',
        },
        order_meta: {
          return_url: `${process.env.APP_URL || 'http://localhost:3000'}?order_id={order_id}&order_status={order_status}`,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[CASHFREE] Create order failed:', data);
      return res.status(500).json({ error: data.message || 'Failed to create order' });
    }

    console.log(`\x1b[32m[PAYMENT] Order created: ${orderId} for ${userEmail}\x1b[0m`);
    res.json({
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      amount,
    });
  } catch (err) {
    console.error('[CASHFREE] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Cashfree: Verify Order ──────────────────────────────────────────────────
app.post('/api/verify-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId is required' });

    const response = await fetch(`${CASHFREE_BASE}/pg/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.message || 'Verification failed' });
    }

    const paid = data.order_status === 'PAID';
    console.log(`\x1b[${paid ? '32' : '31'}m[PAYMENT] Order ${orderId}: ${data.order_status}\x1b[0m`);
    res.json({ paid, status: data.order_status, amount: data.order_amount });
  } catch (err) {
    console.error('[CASHFREE] Verify error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Cashfree: Webhook (optional — only needed if Cashfree dashboard requires a URL) ──
app.post('/api/webhook', (req, res) => {
  const event = req.body;
  const orderId = event?.data?.order?.order_id || 'unknown';
  const status = event?.data?.payment?.payment_status || event?.type || 'unknown';
  console.log(`\x1b[35m[WEBHOOK] ${event?.type || 'EVENT'} | Order: ${orderId} | Status: ${status}\x1b[0m`);
  // Payment verification is handled by the frontend via /api/verify-order
  // This endpoint just acknowledges receipt so Cashfree doesn't retry
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`\x1b[32m[SERVER] Terminal Logger active on port ${port}\x1b[0m`);
});
