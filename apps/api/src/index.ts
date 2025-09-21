import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

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
      context: async () => ({
        user: null,
        requireAuth: () => {}
      })
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
