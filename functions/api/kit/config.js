import { json } from '../../_lib/paypal.js';
export async function onRequestGet({ env }) {
  return json({ clientId: env.PAYPAL_CLIENT_ID || null, test: env.KIT_TEST_MODE === '1' });
}
