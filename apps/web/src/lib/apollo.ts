import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

type TokenGetter = (() => string | null | undefined | Promise<string | null | undefined>) | string | null | undefined;

const resolveToken = async (getToken?: TokenGetter): Promise<string | null | undefined> => {
  if (typeof getToken === 'function') {
    return Promise.resolve(getToken());
  }

  return getToken ?? null;
};

export const makeClient = (getToken?: TokenGetter): ApolloClient<object> => {
  const httpLink = createHttpLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: 'include'
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await resolveToken(getToken);

    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
};
