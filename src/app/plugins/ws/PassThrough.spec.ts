import { Duplex, PassThrough } from 'node:stream';
import { once } from 'node:events';
describe('Use PassThrough node:stream for streams tests', () => {
  it('Please use node:events queueMicrotask', async () => {
    const mockedStream: Duplex = new PassThrough();
    const data = 'hello world';
    // don't !!!
    // mockedStream.on('data', (d) => {
    //   console.dir(d);
    //   expect(d).toEqual(data);
    // });
    // mockedStream.on('end', function () {
    //   console.dir('goodbye');
    // });

    // P.S. if next tick then use Promise.all for end.
    queueMicrotask(() => {
      mockedStream.emit('data', data);
      mockedStream.end(); //   <-- end. not close.
      mockedStream.destroy();
    });
    // emit('data', ...args)
    const [resp] = await once(mockedStream, 'data');

    expect(resp).toEqual(data);

    await once(mockedStream, 'end');
  });
  it('Or use node:events nextTick', async () => {
    const mockedStream: Duplex = new PassThrough();
    const data = 'hello world';
    // P.S. if next tick then use Promise.all for end.
    process.nextTick(() => {
      mockedStream.emit('data', data);
      mockedStream.end(); //   <-- end. not close.
      mockedStream.destroy();
    });
    const [[resp]] = await Promise.all([
      once(mockedStream, 'data'),
      once(mockedStream, 'end'),
    ]);

    expect(resp).toEqual(data);
  });
  it('Or use for await', async () => {
    const mockedStream: Duplex = new PassThrough();
    const data = 'hello world';
    queueMicrotask(() => {
      mockedStream.emit('data', data);
      mockedStream.end(); //   <-- end. not close.
      mockedStream.destroy();
    });
    for await (const resp of mockedStream) {
      expect(resp).toEqual(data);
    }
  });
});
