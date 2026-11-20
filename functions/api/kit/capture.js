import { tierFor, apiBase, accessToken, json } from '../../_lib/paypal.js';
// Captures the PayPal order on the server, confirms it was paid in full for a known product,
// and only then returns that product's download link.
export async function onRequestPost({ request, env }) {
  try {
    const { orderID } = await request.json();
    if (!orderID || !/^[A-Z0-9]{10,30}$/.test(orderID)) return json({ error: 'Invalid order' }, 400);
    const token = await accessToken(env);
    const h = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' };
    let r = await fetch(apiBase(env) + '/v2/checkout/orders/' + orderID + '/capture', { method: 'POST', headers: h });
    let order = await r.json();
    if (!r.ok) {
      // If the order was already captured (for example, the buyer reloaded), look it up instead.
      const g = await fetch(apiBase(env) + '/v2/checkout/orders/' + orderID, { headers: h });
      order = await g.json();
      if (!g.ok) return json({ error: 'Payment could not be confirmed' }, 402);
    }
    const pu = (order.purchase_units || [])[0] || {};
    const cap = ((pu.payments || {}).captures || [])[0] || {};
    const tierKey = pu.reference_id || cap.custom_id || pu.custom_id;
    const t = tierFor(env, tierKey);
    const amount = (cap.amount || pu.amount || {});
    if (order.status !== 'COMPLETED' || cap.status !== 'COMPLETED' || !t ||
        amount.currency_code !== 'USD' || amount.value !== t.price) {
      return json({ error: 'Payment not completed', status: cap.status || order.status || 'UNKNOWN' }, 402);
    }
    if (t.service) {
      return json({ ok: true, product: t.name, service: t.service, url: t.urlVar ? (env[t.urlVar] || null) : null, order: order.id, email: (order.payer || {}).email_address || null });
    }
    const url = env[t.urlVar];
    if (!url) return json({ error: 'Download not configured' }, 500);
    return json({ ok: true, product: t.name, url, email: (order.payer || {}).email_address || null });
  } catch (e) {
    return json({ error: 'Payment could not be confirmed' }, 500);
  }
}
