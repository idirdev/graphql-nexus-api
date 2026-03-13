# GraphQL Nexus API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Apollo Server](https://img.shields.io/badge/Apollo_Server-4-311C87?logo=apollographql&logoColor=white)](https://apollographql.com)
[![GraphQL](https://img.shields.io/badge/GraphQL-16-E10098?logo=graphql&logoColor=white)](https://graphql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A full-featured GraphQL API built with **Apollo Server 4** and **TypeScript**. Includes complete CRUD operations, entity relationships, role-based authentication, custom error handling, and an in-memory data layer ready for swapping with any database.

---

## Features

- **Full CRUD** for Users, Posts, and Comments
- **Entity Relationships** -- Posts belong to Users, Comments belong to Posts and Users, with nested resolver resolution
- **Role-Based Auth** -- Simple Bearer token auth with ADMIN and USER roles; ownership-based mutation guards
- **Custom Error Handling** -- Typed GraphQL errors: `NotFoundError`, `AuthenticationError`, `AuthorizationError`, `ValidationError`
- **Search and Filtering** -- Search posts by keyword, filter by tag, toggle published/draft visibility
- **Stats Endpoint** -- Aggregate counts for users, posts, and comments
- **Apollo Sandbox** -- Built-in GraphQL playground at server URL
- **Clean Architecture** -- Separated schema, resolvers, models, data sources, middleware, and utilities

---

## Project Structure

```
graphql-nexus-api/
  src/
    index.ts                  # Apollo Server bootstrap
    schema/
      typeDefs.ts             # GraphQL SDL schema
      resolvers.ts            # All query, mutation, and type resolvers
    models/
      User.ts                 # User type + mock data
      Post.ts                 # Post type + mock data
      Comment.ts              # Comment type + mock data
    datasources/
      UserDataSource.ts       # User data access layer
      PostDataSource.ts       # Post + Comment data access layer
    middleware/
      auth.ts                 # Auth extraction + guard helpers
    types/
      context.ts              # GraphQL context type definition
    utils/
      errors.ts               # Custom GraphQL error classes
  package.json
  tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Install and Run

```bash
# Clone the repository
git clone https://github.com/idirdev/graphql-nexus-api.git
cd graphql-nexus-api

# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Or build and run production
npm run build
npm start
```

The server starts at **http://localhost:4000** with Apollo Sandbox enabled.

---

## Authentication

Pass an `Authorization` header with a mock Bearer token:

| Header Value             | User         | Role  |
| ------------------------ | ------------ | ----- |
| `Bearer user-1`         | idirdev      | ADMIN |
| `Bearer user-2`         | sarahcodes   | USER  |
| `Bearer user-3`         | alexknight   | USER  |
| *(no header)*            | Unauthenticated | --  |

---

## Example Queries

### Get all users with their posts

```graphql
query {
  users {
    id
    username
    displayName
    role
    postCount
    posts {
      id
      title
      published
    }
  }
}
```

### Get a single post with comments

```graphql
query {
  post(id: "post-1") {
    title
    content
    author {
      username
    }
    tags
    commentCount
    comments {
      body
      author {
        username
      }
    }
  }
}
```

### Search posts

```graphql
query {
  searchPosts(query: "TypeScript") {
    id
    title
    author {
      username
    }
  }
}
```

### Get current user (requires auth header)

```graphql
query {
  me {
    id
    username
    email
    role
    postCount
    commentCount
  }
}
```

### Create a post (requires auth)

```graphql
mutation {
  createPost(input: {
    title: "My New Post"
    content: "This is the content of my new post."
    published: true
    tags: ["graphql", "tutorial"]
  }) {
    id
    title
    published
    author {
      username
    }
    createdAt
  }
}
```

### Add a comment (requires auth)

```graphql
mutation {
  createComment(input: {
    body: "Great article, thanks for sharing!"
    postId: "post-1"
  }) {
    id
    body
    author {
      username
    }
    post {
      title
    }
  }
}
```

### Delete a post (owner or admin)

```graphql
mutation {
  deletePost(id: "post-4") {
    success
    message
  }
}
```

### Get API stats

```graphql
query {
  stats {
    totalUsers
    totalPosts
    totalPublishedPosts
    totalComments
  }
}
```

---

## Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start dev server with hot reload         |
| `npm run build`   | Compile TypeScript to `dist/`            |
| `npm start`       | Run compiled production build            |
| `npm run typecheck` | Type-check without emitting files      |

---

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript 5.7
- **Server**: Apollo Server 4 (standalone)
- **Schema**: SDL-first with graphql-tag
- **Auth**: Bearer token with role-based guards
- **Data**: In-memory data sources (swap with any DB)

---

## License

MIT

---

## Français

**GraphQL Nexus API** est une API GraphQL complète construite avec Apollo Server 4 et TypeScript. Elle inclut des opérations CRUD complètes pour les utilisateurs, publications et commentaires, une authentification par rôle (ADMIN/USER), une gestion des erreurs typées, ainsi qu'une couche de données en mémoire facilement remplaçable par n'importe quelle base de données.

### Installation

```bash
npm install
npm run dev
```

### Utilisation

Le serveur démarre sur **http://localhost:4000** avec Apollo Sandbox activé. Pour s'authentifier, transmettez un header `Authorization: Bearer user-1` (ADMIN) ou `Bearer user-2` (USER). Vous pouvez ensuite exécuter des requêtes et mutations GraphQL pour gérer les utilisateurs, publications et commentaires.

