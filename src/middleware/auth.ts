import { AuthUser } from "../types/context";

/**
 * Simple token-based auth middleware.
 *
 * In production, this would verify a JWT or session token.
 * For this demo, we accept a mock "Bearer <user-id>" header
 * and look up the user from the data source.
 *
 * Examples:
 *   Authorization: Bearer user-1   -> authenticates as idirdev (ADMIN)
 *   Authorization: Bearer user-2   -> authenticates as sarahcodes (USER)
 *   (no header)                    -> unauthenticated (null)
 */

// Mock user database for auth resolution (matches User model mock data)
const AUTH_USERS: Record<string, AuthUser> = {
  "user-1": { id: "user-1", email: "idir@nexus.dev", role: "ADMIN" },
  "user-2": { id: "user-2", email: "sarah@nexus.dev", role: "USER" },
  "user-3": { id: "user-3", email: "alex@nexus.dev", role: "USER" },
};

export function extractUser(authHeader: string | undefined): AuthUser | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  const token = parts[1];
  return AUTH_USERS[token] ?? null;
}

/**
 * Helper guards for use inside resolvers.
 */
export function requireAuth(user: AuthUser | null): AuthUser {
  if (!user) {
    const { AuthenticationError } = require("../utils/errors");
    throw new AuthenticationError();
  }
  return user;
}

export function requireAdmin(user: AuthUser | null): AuthUser {
  const authed = requireAuth(user);
  if (authed.role !== "ADMIN") {
    const { AuthorizationError } = require("../utils/errors");
    throw new AuthorizationError("Admin access required");
  }
  return authed;
}
