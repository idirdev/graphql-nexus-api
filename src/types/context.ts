import { UserDataSource } from "../datasources/UserDataSource";
import { PostDataSource } from "../datasources/PostDataSource";

export interface AuthUser {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
}

export interface GraphQLContext {
  user: AuthUser | null;
  dataSources: {
    users: UserDataSource;
    posts: PostDataSource;
  };
}
