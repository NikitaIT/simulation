import { timeout, delay } from './utils';
describe('Given utils.timeout and utils.delay race', () => {
  it.each([
    {
      timeout: 10,
      delay: 5,
      expected: 'delay',
    },
    {
      timeout: 5,
      delay: 10,
      expected: 'timeout',
    },
  ])(
    'When timeout=$timeout delay=$delay Then result should be $expected',
    async (config) => {
      const ac = new AbortController();
      const result = await Promise.race([
        timeout(config.timeout, ac.signal).catch(() => 'timeout'),
        delay(config.delay).then(() => 'delay'),
      ]);
      ac.abort(); // stop one of steel not resolved/rejected promises
      expect(result).toEqual(config.expected);
    }
  );
});
