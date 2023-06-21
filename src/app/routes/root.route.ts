import { SocketStream } from '@fastify/websocket';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { chain } from 'stream-chain';
import { pick } from 'stream-json/filters/Pick';
import StreamArray from 'stream-json/streamers/StreamArray';
import { parser } from 'stream-json/Parser';
import { createReadStream } from 'node:fs';
import path from 'node:path';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      request.log.info(
        'includes request information, but is the same logger instance as `log`'
      );
      // this will handle http requests
      reply.send({ hello: 'world' });
    },
    wsHandler: async (connection: SocketStream, req: FastifyRequest) => {
      // this will handle websockets connections
      connection.setEncoding('utf8');

      const readableStream = createReadStream(path.resolve('./feed_live.json'));

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
        // assert.equal(1, 2, "some relevant assertion here");
        // console.debug("!!!" + JSON.stringify(value, null, 2)); // the JSON array element
      }
      connection.write('hello client');

      connection.once('data', (chunk) => {
        connection.end();
      });

      connection.socket.on('message', (message) => {
        // message.toString() === 'hi from client'
        connection.socket.send('hi from server');
      });
    },
  });
}
