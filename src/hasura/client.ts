import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

// Ensure environment variables are loaded correctly
if (
  !process.env.HASURA_GRAPHQL_ENDPOINT ||
  !process.env.HASURA_GRAPHQL_ADMIN_SECRET
) {
  throw new Error(
    "HASURA_GRAPHQL_ENDPOINT or HASURA_GRAPHQL_ADMIN_SECRET is missing in the .env file"
  );
}

// Create an Axios client for Hasura GraphQL API
const client = axios.create({
  baseURL: process.env.HASURA_GRAPHQL_ENDPOINT,
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
    "Content-Type": "application/json",
  },
});

// Function to execute GraphQL queries/mutations
export async function executeGraphQL(
  query: string,
  variables: Record<string, any> = {}
): Promise<any> {
  try {
    console.log(query, "query✅✅✅✅✅✅✅");
    console.log(variables, "variables❌❌❌❌❌❌");
    const response = await client.post("", { query, variables });

    if (response.data.errors) {
      console.error("GraphQL Errors:", response.data.errors);
      throw new Error(JSON.stringify(response.data.errors));
    }
    console.log("GraphQL response:", response.data.data);
    return response.data.data; // Return only the `data` field
  } catch (error: any) {
    console.error(
      "GraphQL Request Failed:",
      error.response?.data || error.message
    );
    throw new Error("GraphQL Request Failed");
  }
}

export default client;
