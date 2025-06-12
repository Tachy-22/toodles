import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./config";
import { User, createUser } from "../../domain/entities/User";

// Helper function to convert Firebase User to our domain User
export const firebaseUserToDomainUser = (
  firebaseUser: FirebaseUser | null
): User | null => {
  if (!firebaseUser) return null;

  return createUser(
    firebaseUser.uid,
    firebaseUser.email,
    firebaseUser.displayName,
    firebaseUser.photoURL
  );
};

// Firebase Auth Service
export const authService = {
  // Register a new user
  async registerUser(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return firebaseUserToDomainUser(userCredential.user) as User;
  },

  // Login a user
  async loginUser(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return firebaseUserToDomainUser(userCredential.user) as User;
  },

  // Logout the current user
  async logoutUser(): Promise<void> {
    await signOut(auth);
  },

  // Get current user
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = fbOnAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(firebaseUserToDomainUser(user));
      });
    });
  },

  // Subscribe to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return fbOnAuthStateChanged(auth, (user) => {
      callback(firebaseUserToDomainUser(user));
    });
  },
};
