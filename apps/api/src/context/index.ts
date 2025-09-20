import { randomUUID } from "node:crypto";
import type { YogaInitialContext } from "graphql-yoga";
import type { Logger } from "pino";

import { logger } from "../logger";

export interface GraphQLContext {
  requestId: string;
  logger: Logger;
}

export function buildContext({ request }: YogaInitialContext): GraphQLContext {
  const requestId = request.headers.get("x-request-id") ?? randomUUID();

  return {
    requestId,
    logger: logger.child({ requestId })
  };
}
