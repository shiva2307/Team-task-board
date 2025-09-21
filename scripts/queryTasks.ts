import axios from 'axios';

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

const QUERY = `
  query Tasks($projectKey: String!) {
    tasks(projectKey: $projectKey) {
      id
      title
      status
      orderIndex
    }
  }
`;

async function main(): Promise<void> {
  try {
    const response = await axios.post(
      GRAPHQL_ENDPOINT,
      {
        query: QUERY,
        variables: { projectKey: 'DEMO' }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('GraphQL request failed:', error.response?.status, error.response?.data ?? error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    process.exitCode = 1;
  }
}

main();
