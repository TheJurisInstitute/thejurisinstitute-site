// Shared helpers for the kit checkout. Secrets come only from Cloudflare environment variables.
export const TIERS = {
  regd_starter:  { price: '497.00', name: 'Reg D Starter Kit',  urlVar: 'KIT_REGD_STARTER_URL' },
  regd_complete: { price: '797.00', name: 'Reg D Complete Kit', urlVar: 'KIT_REGD_COMPLETE_URL' },
  prose_demand:      { price: '49.00',  name: 'Demand Letter Kit',                    urlVar: 'KIT_DEMAND_URL' },
  prose_smallclaims: { price: '79.00',  name: 'Small Claims Court Prep Kit',          urlVar: 'KIT_SMALLCLAIMS_URL' },
  prose_debt:        { price: '97.00',  name: 'Debt Collection Lawsuit Response Kit', urlVar: 'KIT_DEBT_URL' },
  prose_bundle:      { price: '149.00', name: 'Pro Se Toolkit Bundle',                urlVar: 'KIT_PROSE_BUNDLE_URL' },
  plan_estate:       { price: '49.00',  name: 'Estate Planning Organizer',            urlVar: 'KIT_ESTATE_URL' },
  plan_prenup:       { price: '79.00',  name: 'Prenup Preparation Workbook',          urlVar: 'KIT_PRENUP_URL' },
  llc_founder:       { price: '149.00', name: 'LLC Founder Kit',                      urlVar: 'KIT_LLC_URL' },
  kit_attorney:      { price: '29.00',  name: 'Working With Your Attorney Toolkit',   urlVar: 'KIT_ATTORNEY_URL' },
  kit_money:         { price: '39.00',  name: 'Money Reset Kit',                      urlVar: 'KIT_MONEY_URL' },
  coach_quick:       { price: '79.00',  name: 'Written Legal Coaching: Quick Answer', service: 'written' },
  coach_standard:    { price: '149.00', name: 'Written Legal Coaching: Standard',     service: 'written' },
  coach_deep:        { price: '299.00', name: 'Written Legal Coaching: Deep Dive',    service: 'written' },
  call_20:           { price: '49.00',  name: 'Financial Coaching Call (20 minutes)', service: 'call', urlVar: 'CALL_BOOKING_URL' },
  call_40:           { price: '89.00',  name: 'Financial Coaching Call (40 minutes)', service: 'call', urlVar: 'CALL_BOOKING_URL' },
  call_60:           { price: '129.00', name: 'Financial Coaching Call (60 minutes)', service: 'call', urlVar: 'CALL_BOOKING_URL' },
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
