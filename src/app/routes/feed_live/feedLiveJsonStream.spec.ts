import { chain } from 'stream-chain';
import { pick } from 'stream-json/filters/Pick';
import StreamArray from 'stream-json/streamers/StreamArray';
import { parser } from 'stream-json/Parser';
import { createReadStream } from 'node:fs';
import path from 'node:path';

describe('Given feed live', () => {
  it('When liveData.plays.allPlays streamed as Array Then value.result should Be Defined', async () => {
    const readableStream = createReadStream(
      path.resolve(path.join(__dirname, './data.json'))
    );
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
