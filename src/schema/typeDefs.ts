export const typeDefs = `#graphql
  # =============================================
  #  Enums
  # =============================================

  enum Role {
    ADMIN
    USER
  }

  enum SortOrder {
    ASC
    DESC
  }

  # =============================================
  #  Types
  # =============================================

  type User {
    id: ID!
    username: String!
    email: String!
    displayName: String!
    bio: String!
    avatarUrl: String
    role: Role!
    posts: [Post!]!
    comments: [Comment!]!
    postCount: Int!
    commentCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    author: User!
    tags: [String!]!
    comments: [Comment!]!
    commentCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    author: User!
    post: Post!
    createdAt: String!
    updatedAt: String!
  }

  type DeleteResult {
    success: Boolean!
    message: String!
  }

  type Stats {
    totalUsers: Int!
    totalPosts: Int!
    totalPublishedPosts: Int!
    totalComments: Int!
  }

  # =============================================
  #  Inputs
  # =============================================

  input CreateUserInput {
    username: String!
    email: String!
    displayName: String!
    bio: String
  }

  input UpdateUserInput {
    username: String
    email: String
    displayName: String
    bio: String
    avatarUrl: String
  }

  input CreatePostInput {
    title: String!
    content: String!
    published: Boolean
    tags: [String!]
  }

  input UpdatePostInput {
    title: String
    content: String
    published: Boolean
    tags: [String!]
  }

  input CreateCommentInput {
    body: String!
    postId: ID!
  }

  input UpdateCommentInput {
    body: String!
  }

  # =============================================
  #  Queries
  # =============================================

  type Query {
    # Users
    users: [User!]!
    user(id: ID!): User
    userByUsername(username: String!): User
    me: User

    # Posts
    posts(onlyPublished: Boolean): [Post!]!
    post(id: ID!): Post
    postsByTag(tag: String!): [Post!]!
    searchPosts(query: String!): [Post!]!

    # Comments
    comment(id: ID!): Comment

    # Stats
    stats: Stats!
  }

  # =============================================
  #  Mutations
  # =============================================

  type Mutation {
    # Users
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): DeleteResult!

    # Posts
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): DeleteResult!
    publishPost(id: ID!): Post!
    unpublishPost(id: ID!): Post!

    # Comments
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, input: UpdateCommentInput!): Comment!
    deleteComment(id: ID!): DeleteResult!
  }
`;
