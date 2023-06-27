import {
  MatchSimulationJobConfig,
  Restart,
  Start,
  Stop,
} from '@nba-node/domain/match-simulation';
import { Command } from '@nba-node/framework';
import { SocketStream } from '@fastify/websocket';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { useInMemoryData } from './useInMemoryData';

export default async function (
  fastify: FastifyInstance,
  opt: any,
  next: any,
  config: MatchSimulationJobConfig = {
    intervalSec: 10,
    timeoutSec: 90,
  }
) {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      // this will handle http requests
      reply.send({ msg: 'This endpoint provides game simulation stream data' });
    },
    wsHandler: async (connection: SocketStream, req: FastifyRequest) => {
      const { repo, job, entityMap } = useInMemoryData(req.log, config);

      // this will handle websockets connections
      const ws = connection.socket;
      ws.on('message', (message) => {
        req.log.info('command', message.toString());
        let cmd: Command;
        // todo: add validator
        // todo: add binary protocol
        try {
          cmd = JSON.parse(message.toString());
        } catch (e) {
          req.log.error(e);
          return;
        }

        // todo: load handler by type
        const h = {
          [Start.type]: Start.Handler,
          [Stop.type]: Stop.Handler,
          [Restart.type]: Restart.Handler,
        };

        const Type = h[cmd.type];

        if (Type) {
          const handler = new Type(repo, job, req.log);
          handler.handle(cmd as any);
        }
      });

      // todo: move to trx.commit
      [...entityMap.entries()].forEach(([type, map]) => {
        [...map.entries()].forEach(([id, entity]) => {
          entity['onEvent']((x) => {
            ws.send(JSON.stringify(x));
          });
        });
      });
      // connection.socket.close();
    },
  });
}
