export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  published?: boolean;
  tags?: string[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  published?: boolean;
  tags?: string[];
}

// --- Mock Data ---

export const posts: Post[] = [
  {
    id: "post-1",
    title: "Getting Started with GraphQL and Apollo Server 4",
    content:
      "GraphQL is a query language for APIs that gives clients the power to ask for exactly what they need. In this guide, we will walk through setting up Apollo Server 4 with TypeScript, defining schemas, writing resolvers, and connecting data sources. By the end, you will have a fully functional GraphQL API.",
    published: true,
    authorId: "user-1",
    tags: ["graphql", "apollo", "typescript", "tutorial"],
    createdAt: "2025-04-01T08:00:00Z",
    updatedAt: "2025-04-01T08:00:00Z",
  },
  {
    id: "post-2",
    title: "Why TypeScript is Essential for Large-Scale APIs",
    content:
      "Type safety is not just a nice-to-have; it is a critical requirement for maintaining large codebases. TypeScript catches entire categories of bugs at compile time, provides excellent IDE support, and makes refactoring safe. This post explores patterns for using TypeScript effectively in Node.js API projects.",
    published: true,
    authorId: "user-2",
    tags: ["typescript", "nodejs", "best-practices"],
    createdAt: "2025-04-10T12:00:00Z",
    updatedAt: "2025-04-10T12:00:00Z",
  },
  {
    id: "post-3",
    title: "Advanced Resolver Patterns in GraphQL",
    content:
      "Once you have the basics down, it is time to explore advanced resolver patterns: batching with DataLoader, cursor-based pagination, field-level authorization, and computed fields. These patterns will help you build performant and secure GraphQL APIs at scale.",
    published: true,
    authorId: "user-1",
    tags: ["graphql", "resolvers", "advanced", "performance"],
    createdAt: "2025-05-02T16:30:00Z",
    updatedAt: "2025-05-02T16:30:00Z",
  },
  {
    id: "post-4",
    title: "Draft: Error Handling Strategies for GraphQL",
    content:
      "Error handling in GraphQL is fundamentally different from REST. This draft covers union-based error types, custom error codes, partial error responses, and how to give clients actionable error information without leaking internal details.",
    published: false,
    authorId: "user-3",
    tags: ["graphql", "error-handling", "draft"],
    createdAt: "2025-05-15T11:00:00Z",
    updatedAt: "2025-05-15T11:00:00Z",
  },
];
