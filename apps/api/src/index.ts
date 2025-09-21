import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

type AuthenticatedUser = {
  id?: string;
  email?: string;
};

const { verify } = jwt;

async function bootstrap(): Promise<void> {
  const app = express();

  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true
    })
  );

  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization;
        const secret = process.env.JWT_SECRET ?? 'devjwtsecret';
        let user: AuthenticatedUser | null = null;

        if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
          const token = authHeader.slice('Bearer '.length).trim();

          try {
            const decoded = verify(token, secret);

            if (decoded && typeof decoded === 'object') {
              const payload = decoded as JwtPayload;
              user = {
                id: typeof payload.sub === 'string' ? payload.sub : undefined,
                email: typeof payload.email === 'string' ? payload.email : undefined
              };
            }
          } catch (error) {
            console.warn('Failed to verify JWT:', error);
          }
        }

        return {
          user,
          requireAuth: () => {
            if (!user) {
              throw new Error('Unauthorized');
            }
          }
        };
      }
    })
  );

  const port = Number(process.env.PORT) || 4000;

  app.listen(port, () => {
    console.log(`🚀 GraphQL API ready at http://localhost:${port}/graphql`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start API:', error);
  process.exit(1);
});
