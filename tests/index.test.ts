import { describe, it, expect, beforeEach } from 'vitest';
import { PostDataSource } from '../src/datasources/PostDataSource';
import { UserDataSource } from '../src/datasources/UserDataSource';

// ─── PostDataSource ───

describe('PostDataSource', () => {
  let ds: PostDataSource;

  beforeEach(() => {
    ds = new PostDataSource();
  });

  describe('queries', () => {
    it('should get all posts', () => {
      const posts = ds.getAllPosts();
      expect(posts.length).toBeGreaterThan(0);
    });

    it('should filter only published posts', () => {
      const published = ds.getAllPosts(true);
      expect(published.every((p) => p.published)).toBe(true);
    });

    it('should get a post by ID', () => {
      const post = ds.getPostById('post-1');
      expect(post).toBeDefined();
      expect(post!.id).toBe('post-1');
    });

    it('should return undefined for non-existent post', () => {
      expect(ds.getPostById('nonexistent')).toBeUndefined();
    });

    it('should throw for getPostByIdOrThrow with invalid ID', () => {
      expect(() => ds.getPostByIdOrThrow('nonexistent')).toThrow();
    });

    it('should get posts by author', () => {
      const posts = ds.getPostsByAuthor('user-1');
      expect(posts.length).toBeGreaterThan(0);
      expect(posts.every((p) => p.authorId === 'user-1')).toBe(true);
    });

    it('should get published posts by tag', () => {
      const posts = ds.getPostsByTag('graphql');
      expect(posts.length).toBeGreaterThan(0);
      expect(posts.every((p) => p.published && p.tags.includes('graphql'))).toBe(true);
    });

    it('should search posts by title and content', () => {
      const results = ds.searchPosts('GraphQL');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should get comment count for a post', () => {
      const count = ds.getCommentCount('post-1');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should get comments by post', () => {
      const comments = ds.getCommentsByPost('post-1');
      expect(comments.every((c) => c.postId === 'post-1')).toBe(true);
    });
  });

  describe('mutations', () => {
    it('should create a new post', () => {
      const post = ds.createPost('user-1', {
        title: 'Test Post',
        content: 'This is test content.',
        published: true,
        tags: ['test'],
      });

      expect(post.id).toBeDefined();
      expect(post.title).toBe('Test Post');
      expect(post.authorId).toBe('user-1');
      expect(post.published).toBe(true);
      expect(post.tags).toEqual(['test']);
    });

    it('should throw when creating post with empty title', () => {
      expect(() =>
        ds.createPost('user-1', { title: '', content: 'content' })
      ).toThrow();
    });

    it('should throw when creating post with empty content', () => {
      expect(() =>
        ds.createPost('user-1', { title: 'Title', content: '' })
      ).toThrow();
    });

    it('should update a post', () => {
      const updated = ds.updatePost('post-1', { title: 'Updated Title' });
      expect(updated.title).toBe('Updated Title');
    });

    it('should throw when updating non-existent post', () => {
      expect(() => ds.updatePost('nonexistent', { title: 'X' })).toThrow();
    });

    it('should delete a post', () => {
      const result = ds.deletePost('post-1');
      expect(result).toBe(true);
      expect(ds.getPostById('post-1')).toBeUndefined();
    });

    it('should throw when deleting non-existent post', () => {
      expect(() => ds.deletePost('nonexistent')).toThrow();
    });

    it('should publish a post', () => {
      // Post-4 is a draft
      const published = ds.publishPost('post-4');
      expect(published.published).toBe(true);
    });

    it('should unpublish a post', () => {
      const unpublished = ds.unpublishPost('post-1');
      expect(unpublished.published).toBe(false);
    });

    it('should lowercase tags on creation', () => {
      const post = ds.createPost('user-1', {
        title: 'Tags Test',
        content: 'Content here.',
        tags: ['TypeScript', 'GRAPHQL'],
      });
      expect(post.tags).toEqual(['typescript', 'graphql']);
    });
  });

  describe('comments', () => {
    it('should create a comment', () => {
      const comment = ds.createComment('user-1', {
        body: 'Great post!',
        postId: 'post-1',
      });

      expect(comment.id).toBeDefined();
      expect(comment.body).toBe('Great post!');
      expect(comment.authorId).toBe('user-1');
      expect(comment.postId).toBe('post-1');
    });

    it('should throw when creating comment for non-existent post', () => {
      expect(() =>
        ds.createComment('user-1', { body: 'Test', postId: 'nonexistent' })
      ).toThrow();
    });

    it('should throw when creating comment with empty body', () => {
      expect(() =>
        ds.createComment('user-1', { body: '', postId: 'post-1' })
      ).toThrow();
    });

    it('should update a comment', () => {
      const updated = ds.updateComment('comment-1', { body: 'Updated body' });
      expect(updated.body).toBe('Updated body');
    });

    it('should throw when updating comment with empty body', () => {
      expect(() => ds.updateComment('comment-1', { body: '' })).toThrow();
    });

    it('should delete a comment', () => {
      expect(ds.deleteComment('comment-1')).toBe(true);
      expect(ds.getCommentById('comment-1')).toBeUndefined();
    });

    it('should get a comment by ID', () => {
      const comment = ds.getCommentById('comment-1');
      expect(comment).toBeDefined();
      expect(comment!.id).toBe('comment-1');
    });

    it('should get comments by author', () => {
      const comments = ds.getCommentsByAuthor('user-2');
      expect(comments.length).toBeGreaterThan(0);
      expect(comments.every((c) => c.authorId === 'user-2')).toBe(true);
    });

    it('should delete associated comments when deleting a post', () => {
      const commentsBefore = ds.getCommentsByPost('post-1');
      expect(commentsBefore.length).toBeGreaterThan(0);

      ds.deletePost('post-1');

      const commentsAfter = ds.getCommentsByPost('post-1');
      expect(commentsAfter).toHaveLength(0);
    });
  });
});

// ─── UserDataSource ───

describe('UserDataSource', () => {
  let ds: UserDataSource;

  beforeEach(() => {
    ds = new UserDataSource();
  });

  describe('queries', () => {
    it('should get all users', () => {
      const users = ds.getAll();
      expect(users.length).toBeGreaterThan(0);
    });

    it('should get a user by ID', () => {
      const user = ds.getById('user-1');
      expect(user).toBeDefined();
      expect(user!.id).toBe('user-1');
    });

    it('should return undefined for non-existent user', () => {
      expect(ds.getById('nonexistent')).toBeUndefined();
    });

    it('should throw for getByIdOrThrow with invalid ID', () => {
      expect(() => ds.getByIdOrThrow('nonexistent')).toThrow();
    });

    it('should get a user by username', () => {
      const user = ds.getByUsername('idirdev');
      expect(user).toBeDefined();
      expect(user!.username).toBe('idirdev');
    });

    it('should get a user by email', () => {
      const user = ds.getByEmail('idir@nexus.dev');
      expect(user).toBeDefined();
      expect(user!.email).toBe('idir@nexus.dev');
    });

    it('should get multiple users by IDs', () => {
      const users = ds.getByIds(['user-1', 'user-2']);
      expect(users).toHaveLength(2);
    });
  });

  describe('mutations', () => {
    it('should create a new user', () => {
      const user = ds.create({
        username: 'newuser',
        email: 'new@example.com',
        displayName: 'New User',
        bio: 'Hello!',
      });

      expect(user.id).toBeDefined();
      expect(user.username).toBe('newuser');
      expect(user.role).toBe('USER');
    });

    it('should throw when creating with duplicate username', () => {
      expect(() =>
        ds.create({
          username: 'idirdev', // already exists
          email: 'other@example.com',
          displayName: 'Other',
        })
      ).toThrow('already taken');
    });

    it('should throw when creating with duplicate email', () => {
      expect(() =>
        ds.create({
          username: 'unique',
          email: 'idir@nexus.dev', // already exists
          displayName: 'Other',
        })
      ).toThrow('already registered');
    });

    it('should update a user', () => {
      const updated = ds.update('user-1', { displayName: 'Updated Name' });
      expect(updated.displayName).toBe('Updated Name');
    });

    it('should throw when updating non-existent user', () => {
      expect(() => ds.update('nonexistent', { displayName: 'X' })).toThrow();
    });

    it('should throw when updating to existing username', () => {
      expect(() =>
        ds.update('user-1', { username: 'sarahcodes' })
      ).toThrow('already taken');
    });

    it('should delete a user', () => {
      expect(ds.delete('user-3')).toBe(true);
      expect(ds.getById('user-3')).toBeUndefined();
    });

    it('should throw when deleting non-existent user', () => {
      expect(() => ds.delete('nonexistent')).toThrow();
    });
  });
});
