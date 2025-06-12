"use server";

import { User, createUser } from "@/domain/entities/User";
import { auth } from "@/infrastructure/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserInfo,
} from "firebase/auth";

// Helper function to convert Firebase User to our domain User
const firebaseUserToDomainUser = (firebaseUser: UserInfo | null): User | null => {
  if (!firebaseUser) return null;

  return createUser(
    firebaseUser.uid,
    firebaseUser.email,
    firebaseUser.displayName,
    firebaseUser.photoURL
  );
};

// Register a new user (server action)
export async function registerUserAction(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    return firebaseUserToDomainUser(userCredential.user) as User;
  } catch (error: unknown) {
    console.error("Error registering user:", error);
    throw new Error(`Failed to register: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Login a user (server action)
export async function loginUserAction(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    return firebaseUserToDomainUser(userCredential.user) as User;
  } catch (error: unknown) {
    console.error("Error logging in user:", error);
    throw new Error(`Failed to login: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Logout a user (server action)
export async function logoutUserAction(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    console.error("Error logging out user:", error);
    throw new Error(`Failed to logout: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
