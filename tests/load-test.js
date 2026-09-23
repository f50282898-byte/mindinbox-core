import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 200 },  // Spike to 200 concurrent users
    { duration: '30s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.01'],    // Less than 1% failure rate
  },
};

const BASE_URL = 'http://localhost:3000';
const DUMMY_UID = 'test_user_load_123';
const DUMMY_TOKEN = 'Bearer MOCK_TOKEN_FOR_K6';

export default function () {
  // 1. Stress the AI Analysis API (Requires heavy compute)
  const aiPayload = JSON.stringify({
    userText: "أشعر بأن الوقت يمر بسرعة ولا أستطيع اللحاق بأهدافي.",
  });
  
  const aiParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': DUMMY_TOKEN, // Assuming middleware bypass or valid token logic exists for testing
    },
  };

  const resAi = http.post(`${BASE_URL}/api/ai/analyze`, aiPayload, aiParams);
  
  // Rate limiting (429) is expected and considered a successful architectural defense under load
  check(resAi, {
    'AI status is 200 or 429 (Rate Limit)': (r) => r.status === 200 || r.status === 429,
  });

  // 2. Stress the Stripe Checkout Generation API
  const checkoutPayload = JSON.stringify({
    priceId: "price_awakened_placeholder",
    userId: DUMMY_UID,
    userEmail: "loadtest@mindinbox.com",
  });

  const checkoutParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const resCheckout = http.post(`${BASE_URL}/api/stripe/checkout`, checkoutPayload, checkoutParams);

  check(resCheckout, {
    'Checkout status is 200': (r) => r.status === 200,
    'Returns valid Stripe URL': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.url !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1); // Think time between iterations
}

