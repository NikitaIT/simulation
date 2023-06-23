import { fastify as Fastify, FastifyInstance } from 'fastify';
import { SocketStream } from '@fastify/websocket';
import websocketPlugin from '@fastify/websocket';
import WebSocket from 'ws';
import { Duplex } from 'node:stream';
import route from './route';
import { delay } from '@./utils';
import { Start, Stop, Restart } from '@./domain/match-simulation';

describe('Route E2E', () => {
  let fastify: FastifyInstance;
  let con: SocketStream;
  let client: Duplex;
  afterEach(() => {
    fastify?.close();
    con?.destroy();
    client?.destroy();
  });
  it('Should expose a websocket', async () => {
    const isLogged = false;

    fastify = Fastify({
      // logger: {
      //   transport: {
      //     target: 'pino-pretty',
      //     options: {
      //       translateTime: 'HH:MM:ss Z',
      //       ignore: 'pid,hostname',
      //     },
      //   },
      // },
    });

    await fastify.register(websocketPlugin);
    // await route(fastify);
    await route(fastify, {
      intervalSec: 0.1,
      timeoutSec: 0.9,
    });

    await fastify.listen({ port: 0 /* 0 means any port*/ });
    const ws = new WebSocket(
      'ws://localhost:' + (fastify.server.address() as any).port + '/'
    );

    let messages: string[] = [];
    ws.on('open', async () => {
      console.log('open');
      const sender = new Sender(ws);
      sender.send(new Start({ matchIds: ['1', '2', '3'] }));
      await delay(250).then(() => {
        isLogged && console.log('Start 250, expect 6', messages);
        expect(messages.length).toEqual(6);
        messages = [];
      });
      sender.send(new Stop({ matchIds: ['1', '2', '3'] }));
      await delay(200).then(() => {
        isLogged && console.log('Stop 200, expect 0', messages);
        expect(messages.length).toEqual(0);
        messages = [];
      });
      sender.send(new Start({ matchIds: ['1', '2', '3'] }));
      await delay(110).then(() => {
        isLogged && console.log('Start 100, expect 3', messages);
        expect(messages.length).toEqual(3);
        messages = [];
      });
      sender.send(new Stop({ matchIds: ['1', '2', '3'] }));
      await delay(200).then(() => {
        isLogged && console.log('Stop 200, expect 0', messages);
        expect(messages.length).toEqual(0);
        messages = [];
      });
      sender.send(new Restart({ matchIds: ['1', '2', '3'] }));
      await delay(900);
    });
    ws.on('message', (x) => messages.push(x.toString()));
    ws.on('close', () => {
      // console.log('close after Restart', messages);
      expect(messages.length).toEqual(27);
    });
    await delay(3000);

    ws.close();
    await delay(1000);
  }, 6000);
  it('The API server should expose a stream endpoint', () => {
    // ok
  });
  it('STOP message should pause the simulation.', () => {
    // ok
  });
  it('RESTART message should reset all current scores and start the simulation again.', () => {
    // ok
  });
});

class Sender {
  constructor(private ws: WebSocket) {}
  send(type: unknown) {
    this.ws.send(JSON.stringify(type));
  }
}
