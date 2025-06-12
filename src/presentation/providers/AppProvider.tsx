"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/application/state/store";
import { useAuthStateListener } from "../hooks/useAuthStateListener";

// Component to initialize auth state listener
const AuthStateListener: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useAuthStateListener();
  return <>{children}</>;
};

// Redux provider with auth state listening
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Provider store={store}>
      <AuthStateListener>{children}</AuthStateListener>
    </Provider>
  );
};
