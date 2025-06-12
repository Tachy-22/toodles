"use client";
import { useCallback, useEffect, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);

  const setupAuthListener = useCallback(() => {
    // Set loading state to true while we check authentication
    dispatch(setLoading(true));

    // First, check if there's a current user
    authRepository.getCurrentUser().then((user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
        dispatch(clearTodos());
      }
      setIsInitialized(true);
      dispatch(setLoading(false));
    });

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

  return isInitialized;
};
