import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";

import { env } from "./config/env";
import { buildContext } from "./context";
import { logger } from "./logger";
import { schema } from "./schema";

async function main() {
  const yoga = createYoga({
    schema,
    context: buildContext,
    graphqlEndpoint: "/graphql",
    masking: false
  });

  const server = createServer(yoga);

  server.listen(env.PORT, env.HOST, () => {
    logger.info({ url: `http://${env.HOST}:${env.PORT}/graphql` }, "GraphQL API ready");
  });
}

main().catch((error) => {
  logger.error(error, "API bootstrap failed");
  process.exitCode = 1;
});
