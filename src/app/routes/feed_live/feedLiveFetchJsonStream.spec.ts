import { chain } from 'stream-chain';
import { pick } from 'stream-json/filters/Pick';
import StreamArray from 'stream-json/streamers/StreamArray';
import { parser } from 'stream-json/Parser';
import { Readable } from 'node:stream';
import data from './data.json';

describe.skip('Given feed live (real api call)', () => {
  it.skip('When liveData.plays.allPlays streamed as Array Then value.result should Be Defined', async () => {
    const ctrl = new AbortController();
    const response = await fetch(`https://statsapi.web.nhl.com${data.link}`, {
      headers: [['Content-Type', 'application/json']],
      method: 'get',
      //   body: JSON.stringify({}),
      //   credentials: "include",
      //   cache: "no-cache",
      mode: 'cors',
      signal: ctrl.signal,
    });
    if (!response.body) {
      throw new Error('No body');
    }
    const readableStream = Readable.fromWeb(response.body);
    const pipeline = chain([
      readableStream,
      parser(),
      pick({ filter: 'liveData.plays.allPlays' }),
      new StreamArray(),
      ({ value }) => {
        return value;
      }, // filterMap
    ]);
    for await (const value of pipeline) {
      expect(value.result).toBeDefined();
    }
  }, 1000);
});
