import { users, User, CreateUserInput, UpdateUserInput } from "../models/User";
import { NotFoundError, ValidationError } from "../utils/errors";

export class UserDataSource {
  private users: User[] = [...users];
  private nextId: number = this.users.length + 1;

  // --- Queries ---

  getAll(): User[] {
    return this.users;
  }

  getById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getByIdOrThrow(id: string): User {
    const user = this.getById(id);
    if (!user) {
      throw new NotFoundError("User", id);
    }
    return user;
  }

  getByUsername(username: string): User | undefined {
    return this.users.find((u) => u.username === username);
  }

  getByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  getByIds(ids: string[]): User[] {
    return this.users.filter((u) => ids.includes(u.id));
  }

  // --- Mutations ---

  create(input: CreateUserInput): User {
    if (this.getByUsername(input.username)) {
      throw new ValidationError(
        `Username "${input.username}" is already taken`,
        "username"
      );
    }
    if (this.getByEmail(input.email)) {
      throw new ValidationError(
        `Email "${input.email}" is already registered`,
        "email"
      );
    }

    const now = new Date().toISOString();
    const user: User = {
      id: `user-${this.nextId++}`,
      username: input.username,
      email: input.email,
      displayName: input.displayName,
      bio: input.bio ?? "",
      avatarUrl: null,
      role: "USER",
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(user);
    return user;
  }

  update(id: string, input: UpdateUserInput): User {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundError("User", id);
    }

    if (input.username && input.username !== this.users[index].username) {
      if (this.getByUsername(input.username)) {
        throw new ValidationError(
          `Username "${input.username}" is already taken`,
          "username"
        );
      }
    }

    if (input.email && input.email !== this.users[index].email) {
      if (this.getByEmail(input.email)) {
        throw new ValidationError(
          `Email "${input.email}" is already registered`,
          "email"
        );
      }
    }

    this.users[index] = {
      ...this.users[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    return this.users[index];
  }

  delete(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundError("User", id);
    }
    this.users.splice(index, 1);
    return true;
  }
}
