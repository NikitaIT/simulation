import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import websocket from '@fastify/websocket';

/**
 * This plugins adds basic websocket support for fastify
 *
 * @see https://github.com/fastify/fastify-websocket
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify.register(websocket);
});
