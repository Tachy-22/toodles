import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { User } from "../../domain/entities/User";
import { authService } from "../firebase/authService";

// Firebase implementation of the Auth Repository
export class FirebaseAuthRepo implements AuthRepository {
  async registerUser(email: string, password: string): Promise<User> {
    return authService.registerUser(email, password);
  }

  async loginUser(email: string, password: string): Promise<User> {
    return authService.loginUser(email, password);
  }

  async logoutUser(): Promise<void> {
    return authService.logoutUser();
  }

  async getCurrentUser(): Promise<User | null> {
    return authService.getCurrentUser();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return authService.onAuthStateChanged(callback);
  }
}
