import { SocketStream } from '@fastify/websocket';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      // this will handle http requests
      reply.send({ msg: 'This endpoint provides feed_live data' });
    },
    wsHandler: async (connection: SocketStream, req: FastifyRequest) => {
      // this will handle websockets connections
      connection.setEncoding('utf8');
      //   connection.socket.send(JSON.stringify({ a: 3 }));
      connection.write('hello client');

      connection.once('data', (chunk) => {
        connection.end();
      });

      //   connection.socket.on('message', (message) => {
      //     // message.toString() === 'hi from client'
      //     connection.socket.send('hi from server');
      //   });
    },
  });
}
