export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
  const CASHFREE_ENV = process.env.CASHFREE_ENV || 'production';
  const BASE = CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com'
    : 'https://sandbox.cashfree.com';

  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    return res.status(500).json({ error: 'Cashfree credentials not configured on server' });
  }

  try {
    const response = await fetch(`${BASE}/pg/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2025-01-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({
        error: data.message || 'Verification failed',
        code: data.code,
        details: data,
      });
    }

    res.json({
      paid: data.order_status === 'PAID',
      status: data.order_status,
      amount: data.order_amount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
