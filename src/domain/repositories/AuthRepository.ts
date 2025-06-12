import { User } from "../entities/User";

// Abstract repository interface for authentication operations
export interface AuthRepository {
  // Register a new user
  registerUser(email: string, password: string): Promise<User>;

  // Login a user
  loginUser(email: string, password: string): Promise<User>;

  // Logout the current user
  logoutUser(): Promise<void>;

  // Get the current authenticated user
  getCurrentUser(): Promise<User | null>;

  // Subscribe to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
