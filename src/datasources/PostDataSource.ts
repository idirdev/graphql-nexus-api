import { posts, Post, CreatePostInput, UpdatePostInput } from "../models/Post";
import {
  comments,
  Comment,
  CreateCommentInput,
  UpdateCommentInput,
} from "../models/Comment";
import { NotFoundError, ValidationError } from "../utils/errors";

export class PostDataSource {
  private posts: Post[] = [...posts];
  private comments: Comment[] = [...comments];
  private nextPostId: number = this.posts.length + 1;
  private nextCommentId: number = this.comments.length + 1;

  // --- Post Queries ---

  getAllPosts(onlyPublished: boolean = false): Post[] {
    if (onlyPublished) {
      return this.posts.filter((p) => p.published);
    }
    return this.posts;
  }

  getPostById(id: string): Post | undefined {
    return this.posts.find((p) => p.id === id);
  }

  getPostByIdOrThrow(id: string): Post {
    const post = this.getPostById(id);
    if (!post) {
      throw new NotFoundError("Post", id);
    }
    return post;
  }

  getPostsByAuthor(authorId: string): Post[] {
    return this.posts.filter((p) => p.authorId === authorId);
  }

  getPostsByTag(tag: string): Post[] {
    return this.posts.filter(
      (p) => p.published && p.tags.includes(tag.toLowerCase())
    );
  }

  searchPosts(query: string): Post[] {
    const q = query.toLowerCase();
    return this.posts.filter(
      (p) =>
        p.published &&
        (p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q))
    );
  }

  // --- Post Mutations ---

  createPost(authorId: string, input: CreatePostInput): Post {
    if (!input.title.trim()) {
      throw new ValidationError("Title cannot be empty", "title");
    }
    if (!input.content.trim()) {
      throw new ValidationError("Content cannot be empty", "content");
    }

    const now = new Date().toISOString();
    const post: Post = {
      id: `post-${this.nextPostId++}`,
      title: input.title.trim(),
      content: input.content.trim(),
      published: input.published ?? false,
      authorId,
      tags: (input.tags ?? []).map((t) => t.toLowerCase()),
      createdAt: now,
      updatedAt: now,
    };

    this.posts.push(post);
    return post;
  }

  updatePost(id: string, input: UpdatePostInput): Post {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundError("Post", id);
    }

    if (input.title !== undefined && !input.title.trim()) {
      throw new ValidationError("Title cannot be empty", "title");
    }

    this.posts[index] = {
      ...this.posts[index],
      ...input,
      tags: input.tags
        ? input.tags.map((t) => t.toLowerCase())
        : this.posts[index].tags,
      updatedAt: new Date().toISOString(),
    };

    return this.posts[index];
  }

  deletePost(id: string): boolean {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundError("Post", id);
    }
    // Also remove associated comments
    this.comments = this.comments.filter((c) => c.postId !== id);
    this.posts.splice(index, 1);
    return true;
  }

  publishPost(id: string): Post {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundError("Post", id);
    }
    this.posts[index].published = true;
    this.posts[index].updatedAt = new Date().toISOString();
    return this.posts[index];
  }

  unpublishPost(id: string): Post {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundError("Post", id);
    }
    this.posts[index].published = false;
    this.posts[index].updatedAt = new Date().toISOString();
    return this.posts[index];
  }

  // --- Comment Queries ---

  getCommentsByPost(postId: string): Comment[] {
    return this.comments.filter((c) => c.postId === postId);
  }

  getCommentsByAuthor(authorId: string): Comment[] {
    return this.comments.filter((c) => c.authorId === authorId);
  }

  getCommentById(id: string): Comment | undefined {
    return this.comments.find((c) => c.id === id);
  }

  getCommentCount(postId: string): number {
    return this.comments.filter((c) => c.postId === postId).length;
  }

  // --- Comment Mutations ---

  createComment(authorId: string, input: CreateCommentInput): Comment {
    // Verify the post exists
    this.getPostByIdOrThrow(input.postId);

    if (!input.body.trim()) {
      throw new ValidationError("Comment body cannot be empty", "body");
    }

    const now = new Date().toISOString();
    const comment: Comment = {
      id: `comment-${this.nextCommentId++}`,
      body: input.body.trim(),
      authorId,
      postId: input.postId,
      createdAt: now,
      updatedAt: now,
    };

    this.comments.push(comment);
    return comment;
  }

  updateComment(id: string, input: UpdateCommentInput): Comment {
    const index = this.comments.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundError("Comment", id);
    }

    if (!input.body.trim()) {
      throw new ValidationError("Comment body cannot be empty", "body");
    }

    this.comments[index] = {
      ...this.comments[index],
      body: input.body.trim(),
      updatedAt: new Date().toISOString(),
    };

    return this.comments[index];
  }

  deleteComment(id: string): boolean {
    const index = this.comments.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundError("Comment", id);
    }
    this.comments.splice(index, 1);
    return true;
  }
}
