'use strict';

import { fastify as Fastify, FastifyInstance } from 'fastify';
import { SocketStream } from '@fastify/websocket';
import websocketPlugin from '@fastify/websocket';
import WebSocket from 'ws';
import { once } from 'node:events';
import { Duplex, PassThrough } from 'node:stream';

describe.skip('lp', () => {
  let fastify: FastifyInstance;
  let con: SocketStream;
  let client: Duplex;
  afterEach(() => {
    fastify?.close();
    con?.destroy();
    client?.destroy();
  });
  it('Should expose a websocket', async () => {
    fastify = Fastify();

    await fastify.register(websocketPlugin);

    fastify.get('/', { websocket: true }, async (connection) => {
      con = connection;
      connection.setEncoding('utf8');

      once(connection, 'data').then(([chunk]) => {
        expect(chunk).toEqual('hello server');
        connection.write('hello client');
        connection.end();
      });
    });

    await fastify.listen({ port: 0 /* 0 means any port*/ });
    const ws = new WebSocket(
      'ws://localhost:' + (fastify.server.address() as any).port
    );
    client = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });

    client.setEncoding('utf8');
    client.write('hello server');

    const [chunk] = await once(client, 'data');
    expect(chunk).toEqual('hello client');
    client.end();
  });
});
