// Shared helpers for the kit checkout. Secrets come only from Cloudflare environment variables.
export const TIERS = {
  regd_starter:  { price: '497.00', name: 'Reg D Starter Kit',  urlVar: 'KIT_REGD_STARTER_URL' },
  regd_complete: { price: '797.00', name: 'Reg D Complete Kit', urlVar: 'KIT_REGD_COMPLETE_URL' },
  test_one:      { price: '1.00',   name: 'Checkout Test (owner only)', urlVar: 'KIT_REGD_STARTER_URL', testOnly: true },
};
export function tierFor(env, key) {
  const t = TIERS[key];
  if (!t) return null;
  if (t.testOnly && env.KIT_TEST_MODE !== '1') return null;
  return t;
}
export function apiBase(env) {
  return env.PAYPAL_ENV === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
}
export async function accessToken(env) {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) throw new Error('PayPal is not configured');
  const r = await fetch(apiBase(env) + '/v1/oauth2/token', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + btoa(env.PAYPAL_CLIENT_ID + ':' + env.PAYPAL_CLIENT_SECRET), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  if (!r.ok) throw new Error('PayPal authentication failed');
  return (await r.json()).access_token;
}
export const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});
