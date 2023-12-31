import * as path from 'path';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import plugin from 'fastify-graceful-shutdown';
/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    indexPattern: /.*plugin(\.ts|\.js|\.cjs|\.mjs)$/,
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    indexPattern: /.*route(\.ts|\.js|\.cjs|\.mjs)$/,
    options: { ...opts },
  });

  fastify.register(plugin);
  fastify.after(() => {
    fastify.gracefulShutdown((signal, next) => {
      console.log('Shutdown!');
      next();
    });
  });
}
