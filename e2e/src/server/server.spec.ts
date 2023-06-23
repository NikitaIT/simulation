import axios from 'axios';
import autocannon from 'autocannon';

describe('GET /', () => {
  // todo: skip this tests in jest watch
  it('should return a message', async () => {
    // const res = await axios.get(`/`);
    // expect(res.status).toBe(200);
    // expect(res.data).toEqual({ hello: 'world' });
  });
  // it('should have good performance2', async () => {
  //   const results = await autocannon({
  //     duration: 5,
  //     method: 'GET',
  //     url: axios.defaults.baseURL + '/',
  //   });
  //   expect(results.non2xx).toBe(0);
  //   expect(results.errors).toBe(0);
  //   expect(results.latency.p99).toBeLessThan(50); // Meaning the 99% of my requests were faster than 50 ms.
  //   expect(results.requests.total).toBeGreaterThan(50000); // rps
  // }, 7000);
});
