export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  username: string;
  email: string;
  displayName: string;
  bio?: string;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

// --- Mock Data ---

export const users: User[] = [
  {
    id: "user-1",
    username: "idirdev",
    email: "idir@nexus.dev",
    displayName: "Idir N.",
    bio: "Full-stack developer building with GraphQL and TypeScript.",
    avatarUrl: null,
    role: "ADMIN",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "user-2",
    username: "sarahcodes",
    email: "sarah@nexus.dev",
    displayName: "Sarah Chen",
    bio: "Backend engineer. Rust enthusiast. Coffee addict.",
    avatarUrl: "https://avatars.example.com/sarah.png",
    role: "USER",
    createdAt: "2025-02-10T14:30:00Z",
    updatedAt: "2025-02-10T14:30:00Z",
  },
  {
    id: "user-3",
    username: "alexknight",
    email: "alex@nexus.dev",
    displayName: "Alex Knight",
    bio: "Designer turned developer. Building beautiful APIs.",
    avatarUrl: "https://avatars.example.com/alex.png",
    role: "USER",
    createdAt: "2025-03-05T09:15:00Z",
    updatedAt: "2025-03-05T09:15:00Z",
  },
];
