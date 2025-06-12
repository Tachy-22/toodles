"use client"
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FirebaseAuthRepo } from "@/infrastructure/repositories/FirebaseAuthRepo";
import { setUser, setLoading } from "@/application/state/authSlice";
import { clearTodos } from "@/application/state/todoSlice";
import { AppDispatch } from "@/application/state/store";

// Create an instance of the auth repository
const authRepository = new FirebaseAuthRepo();

// Auth provider hook for Firebase authentication state
export const useAuthStateListener = () => {
  const dispatch = useDispatch<AppDispatch>();

  const setupAuthListener = useCallback(() => {
    // Subscribe to Firebase auth state changes
    return authRepository.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        dispatch(setUser(user));
      } else {
        // User is signed out
        dispatch(setUser(null));
        dispatch(clearTodos());
      }

      // Set loading to false after auth state is determined
      dispatch(setLoading(false));
    });
  }, [dispatch]);

  useEffect(() => {
    // Set up the auth state listener when the component mounts
    const unsubscribe = setupAuthListener();

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [setupAuthListener]);
};
