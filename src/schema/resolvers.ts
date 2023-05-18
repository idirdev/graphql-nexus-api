import { GraphQLContext } from "../types/context";
import { requireAuth, requireAdmin } from "../middleware/auth";

export const resolvers = {
  // =============================================
  //  Queries
  // =============================================

  Query: {
    // --- Users ---
    users: (_: unknown, __: unknown, { dataSources }: GraphQLContext) => {
      return dataSources.users.getAll();
    },

    user: (_: unknown, { id }: { id: string }, { dataSources }: GraphQLContext) => {
      return dataSources.users.getById(id) ?? null;
    },

    userByUsername: (
      _: unknown,
      { username }: { username: string },
      { dataSources }: GraphQLContext
    ) => {
      return dataSources.users.getByUsername(username) ?? null;
    },

    me: (_: unknown, __: unknown, { user, dataSources }: GraphQLContext) => {
      if (!user) return null;
      return dataSources.users.getById(user.id) ?? null;
    },

    // --- Posts ---
    posts: (
      _: unknown,
      { onlyPublished }: { onlyPublished?: boolean },
      { dataSources }: GraphQLContext
    ) => {
      return dataSources.posts.getAllPosts(onlyPublished ?? false);
    },

    post: (_: unknown, { id }: { id: string }, { dataSources }: GraphQLContext) => {
      return dataSources.posts.getPostById(id) ?? null;
    },

    postsByTag: (
      _: unknown,
      { tag }: { tag: string },
      { dataSources }: GraphQLContext
    ) => {
      return dataSources.posts.getPostsByTag(tag);
    },

    searchPosts: (
      _: unknown,
      { query }: { query: string },
      { dataSources }: GraphQLContext
    ) => {
      return dataSources.posts.searchPosts(query);
    },

    // --- Comments ---
    comment: (
      _: unknown,
      { id }: { id: string },
      { dataSources }: GraphQLContext
    ) => {
      return dataSources.posts.getCommentById(id) ?? null;
    },

    // --- Stats ---
    stats: (_: unknown, __: unknown, { dataSources }: GraphQLContext) => {
      const allPosts = dataSources.posts.getAllPosts();
      const publishedPosts = dataSources.posts.getAllPosts(true);
      const allUsers = dataSources.users.getAll();

      // Sum all comment counts across posts
      let totalComments = 0;
      for (const post of allPosts) {
        totalComments += dataSources.posts.getCommentCount(post.id);
      }

      return {
        totalUsers: allUsers.length,
        totalPosts: allPosts.length,
        totalPublishedPosts: publishedPosts.length,
        totalComments,
      };
    },
  },

  // =============================================
  //  Mutations
  // =============================================

  Mutation: {
    // --- Users ---
    createUser: (
      _: unknown,
      { input }: { input: { username: string; email: string; displayName: string; bio?: string } },
      { dataSources }: GraphQLContext
    ) => {
      return dataSources.users.create(input);
    },

    updateUser: (
      _: unknown,
      { id, input }: { id: string; input: Record<string, string> },
      { user, dataSources }: GraphQLContext
    ) => {
      const authed = requireAuth(user);
      // Users can update themselves, admins can update anyone
      if (authed.id !== id && authed.role !== "ADMIN") {
        const { AuthorizationError } = require("../utils/errors");
        throw new AuthorizationError("You can only update your own profile");
      }
      return dataSources.users.update(id, input);
    },

    deleteUser: (
      _: unknown,
      { id }: { id: string },
      { user, dataSources }: GraphQLContext
    ) => {
      requireAdmin(user);
      dataSources.users.delete(id);
      return { success: true, message: `User ${id} deleted successfully` };
    },

    // --- Posts ---
    createPost: (
      _: unknown,
      { input }: { input: { title: string; content: string; published?: boolean; tags?: string[] } },
      { user, dataSources }: GraphQLContext
    ) => {
      const authed = requireAuth(user);
      return dataSources.posts.createPost(authed.id, input);
    },

    updatePost: (
      _: unknown,
      { id, input }: { id: string; input: Record<string, unknown> },
      { user, dataSources }: GraphQLContext
    ) => {
      const authed = requireAuth(user);
      const post = dataSources.posts.getPostByIdOrThrow(id);
      if (post.authorId !== authed.id && authed.role !== "ADMIN") {
        const { AuthorizationError } = require("../utils/errors");
        throw new AuthorizationError("You can only update your own posts");
      }
      return dataSources.posts.updatePost(id, input);
    },

    deletePost: (
      _: unknown,
      { id }: { id: string },
      { user, dataSources }: GraphQLContext
    ) => {
      const authed = requireAuth(user);
      const post = dataSources.posts.getPostByIdOrThrow(id);
      if (post.authorId !== authed.id && authed.role !== "ADMIN") {
        const { AuthorizationError } = require("../utils/errors");
        throw new AuthorizationError("You can only delete your own posts");
      }
      dataSources.posts.deletePost(id);
      return { success: true, message: `Post ${id} deleted successfully` };
    },

    publishPost: (
      _: unknown,
      { id }: { id: string },
      { user, dataSources }: GraphQLContext
    ) => {
      const authed = requireAuth(user);
      const post = dataSources.posts.getPostByIdOrThrow(id);
      if (post.authorId !== authed.id && authed.role !== "ADMIN") {
        const { AuthorizationError } = require("../utils/errors");
        throw new AuthorizationError("You can only publish your own posts");
      }
      return dataSources.posts.publishPost(id);
    },

    unpublishPost: (
      _: unknown,
      { id }: { id: string },
      { user, dataSources }: GraphQLContext
    ) => {
      const authed = requireAuth(user);
      const post = dataSources.posts.getPostByIdOrThrow(id);
      if (post.authorId !== authed.id && authed.role !== "ADMIN") {
        const { AuthorizationError } = require("../utils/errors");
        throw new AuthorizationError("You can only unpublish your own posts");
      }
      return dataSources.posts.unpublishPost(id);
    },

    // --- Comments ---
    createComment: (
      _: unknown,
      { input }: { input: { body: string; postId: string } },
      { user, dataSources }: GraphQLContext
    ) => {
      const authed = requireAuth(user);
      return dataSources.posts.createComment(authed.id, input);
    },

    updateComment: (
      _: unknown,
      { id, input }: { id: string; input: { body: string } },
      { user, dataSources }: GraphQLContext
    ) => {
      const authed = requireAuth(user);
      const comment = dataSources.posts.getCommentById(id);
      if (!comment) {
        const { NotFoundError } = require("../utils/errors");
        throw new NotFoundError("Comment", id);
      }
      if (comment.authorId !== authed.id && authed.role !== "ADMIN") {
        const { AuthorizationError } = require("../utils/errors");
        throw new AuthorizationError("You can only update your own comments");
      }
      return dataSources.posts.updateComment(id, input);
    },

    deleteComment: (
      _: unknown,
      { id }: { id: string },
      { user, dataSources }: GraphQLContext
    ) => {
      const authed = requireAuth(user);
      const comment = dataSources.posts.getCommentById(id);
      if (!comment) {
        const { NotFoundError } = require("../utils/errors");
        throw new NotFoundError("Comment", id);
      }
      if (comment.authorId !== authed.id && authed.role !== "ADMIN") {
        const { AuthorizationError } = require("../utils/errors");
        throw new AuthorizationError("You can only delete your own comments");
      }
      dataSources.posts.deleteComment(id);
      return { success: true, message: `Comment ${id} deleted successfully` };
    },
  },

  // =============================================
  //  Type Resolvers (relationships)
  // =============================================

  User: {
    posts: (parent: { id: string }, _: unknown, { dataSources }: GraphQLContext) => {
      return dataSources.posts.getPostsByAuthor(parent.id);
    },
    comments: (parent: { id: string }, _: unknown, { dataSources }: GraphQLContext) => {
      return dataSources.posts.getCommentsByAuthor(parent.id);
    },
    postCount: (parent: { id: string }, _: unknown, { dataSources }: GraphQLContext) => {
      return dataSources.posts.getPostsByAuthor(parent.id).length;
    },
    commentCount: (parent: { id: string }, _: unknown, { dataSources }: GraphQLContext) => {
      return dataSources.posts.getCommentsByAuthor(parent.id).length;
    },
  },

  Post: {
    author: (parent: { authorId: string }, _: unknown, { dataSources }: GraphQLContext) => {
      return dataSources.users.getByIdOrThrow(parent.authorId);
    },
    comments: (parent: { id: string }, _: unknown, { dataSources }: GraphQLContext) => {
      return dataSources.posts.getCommentsByPost(parent.id);
    },
    commentCount: (parent: { id: string }, _: unknown, { dataSources }: GraphQLContext) => {
      return dataSources.posts.getCommentCount(parent.id);
    },
  },

  Comment: {
    author: (parent: { authorId: string }, _: unknown, { dataSources }: GraphQLContext) => {
      return dataSources.users.getByIdOrThrow(parent.authorId);
    },
    post: (parent: { postId: string }, _: unknown, { dataSources }: GraphQLContext) => {
      return dataSources.posts.getPostByIdOrThrow(parent.postId);
    },
  },
};
