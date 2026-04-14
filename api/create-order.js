export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, userEmail, userName, amount = 20 } = req.body;
  if (!userId || !userEmail) {
    return res.status(400).json({ error: 'userId and userEmail are required' });
  }

  const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
  const CASHFREE_ENV = process.env.CASHFREE_ENV || 'production';
  const BASE = CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com'
    : 'https://sandbox.cashfree.com';

  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    return res.status(500).json({ error: 'Cashfree credentials not configured on server' });
  }

  // order_id: 3–45 chars, alphanumeric + underscore/hyphen only
  const orderId = `ekti_${userId.slice(0, 8)}_${Date.now()}`;
  // customer_id: 3–50 alphanumeric chars only (no special chars)
  const customerId = userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 50).padEnd(3, '0');

  try {
    const response = await fetch(`${BASE}/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2025-01-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-idempotency-key': orderId,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: customerId,
          customer_phone: '9999999999',
          customer_email: userEmail,
          customer_name: userName || 'User',
        },
        order_meta: {
          return_url: `https://ektiai.vercel.app?order_id={order_id}&order_status={order_status}`,
          notify_url: `https://ektiai.vercel.app/api/webhook`,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({
        error: data.message || 'Failed to create order',
        code: data.code,
        details: data,
      });
    }

    res.json({
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      amount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
