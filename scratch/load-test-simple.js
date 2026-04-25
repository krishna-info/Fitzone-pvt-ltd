import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // ramp up to 20 users
    { duration: '1m', target: 20 },  // stay at 20 users
    { duration: '20s', target: 0 },  // ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must be below 500ms
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000';

  // 1. Visit Home Page
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    'home status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // 2. Visit Blog Page
  const blogRes = http.get(`${BASE_URL}/blog`);
  check(blogRes, {
    'blog status is 200': (r) => r.status === 200,
  });

  sleep(2);
}
