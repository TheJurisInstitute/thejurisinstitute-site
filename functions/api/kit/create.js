import { tierFor, apiBase, accessToken, json } from '../../_lib/paypal.js';
export async function onRequestPost({ request, env }) {
  try {
    const { tier } = await request.json();
    const t = tierFor(env, tier);
    if (!t) return json({ error: 'Unknown product' }, 400);
    const token = await accessToken(env);
    const r = await fetch(apiBase(env) + '/v2/checkout/orders', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ reference_id: tier, custom_id: tier, description: t.name + ' (digital download)',
          amount: { currency_code: 'USD', value: t.price } }],
        application_context: { brand_name: 'The Juris Institute', shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW' },
      }),
    });
    const data = await r.json();
    if (!r.ok || !data.id) return json({ error: 'Could not start checkout' }, 502);
    return json({ id: data.id });
  } catch (e) {
    return json({ error: 'Checkout is temporarily unavailable' }, 500);
  }
}
