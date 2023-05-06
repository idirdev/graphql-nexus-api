export interface Comment {
  id: string;
  body: string;
  authorId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  body: string;
  postId: string;
}

export interface UpdateCommentInput {
  body: string;
}

// --- Mock Data ---

export const comments: Comment[] = [
  {
    id: "comment-1",
    body: "Great introduction! This helped me understand the Apollo Server 4 migration path.",
    authorId: "user-2",
    postId: "post-1",
    createdAt: "2025-04-02T09:30:00Z",
    updatedAt: "2025-04-02T09:30:00Z",
  },
  {
    id: "comment-2",
    body: "I would love to see a follow-up on subscriptions with Apollo Server 4.",
    authorId: "user-3",
    postId: "post-1",
    createdAt: "2025-04-03T14:15:00Z",
    updatedAt: "2025-04-03T14:15:00Z",
  },
  {
    id: "comment-3",
    body: "Strongly agree on the refactoring point. TypeScript saved us from so many breaking changes.",
    authorId: "user-1",
    postId: "post-2",
    createdAt: "2025-04-11T10:00:00Z",
    updatedAt: "2025-04-11T10:00:00Z",
  },
  {
    id: "comment-4",
    body: "The DataLoader section is exactly what I needed. Batching reduced our query count by 80%.",
    authorId: "user-2",
    postId: "post-3",
    createdAt: "2025-05-03T08:45:00Z",
    updatedAt: "2025-05-03T08:45:00Z",
  },
  {
    id: "comment-5",
    body: "Would be great to include examples with cursor-based pagination using Relay spec.",
    authorId: "user-3",
    postId: "post-3",
    createdAt: "2025-05-04T17:20:00Z",
    updatedAt: "2025-05-04T17:20:00Z",
  },
];
