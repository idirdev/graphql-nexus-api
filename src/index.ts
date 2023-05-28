import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";
import { GraphQLContext } from "./types/context";
import { UserDataSource } from "./datasources/UserDataSource";
import { PostDataSource } from "./datasources/PostDataSource";
import { extractUser } from "./middleware/auth";

const PORT = parseInt(process.env.PORT || "4000", 10);

async function bootstrap() {
  // Create Apollo Server instance
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    introspection: true,
    formatError: (formattedError) => {
      // Log the error server-side for debugging
      console.error("[GraphQL Error]", JSON.stringify(formattedError, null, 2));

      // Return sanitized error to client
      return {
        message: formattedError.message,
        extensions: {
          code: formattedError.extensions?.code ?? "INTERNAL_SERVER_ERROR",
          ...(formattedError.extensions?.field
            ? { field: formattedError.extensions.field }
            : {}),
        },
      };
    },
  });

  // Start the standalone HTTP server
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req }): Promise<GraphQLContext> => {
      // Extract auth user from Authorization header
      const authHeader = req.headers.authorization;
      const user = extractUser(authHeader);

      // Create fresh data sources per request
      return {
        user,
        dataSources: {
          users: new UserDataSource(),
          posts: new PostDataSource(),
        },
      };
    },
  });

  console.log("-------------------------------------------");
  console.log("  GraphQL Nexus API");
  console.log(`  Server ready at ${url}`);
  console.log(`  Apollo Sandbox: ${url}`);
  console.log("-------------------------------------------");
  console.log("");
  console.log("  Auth: pass 'Authorization: Bearer user-1' header");
  console.log("  Roles: user-1 = ADMIN, user-2/user-3 = USER");
  console.log("-------------------------------------------");
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
