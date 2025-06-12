"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/application/state/store";
import { useAuthStateListener } from "../hooks/useAuthStateListener";

// Component to initialize auth state listener
const AuthStateListener: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  // Render children once auth is initialized
  return <>{children}</>;
};

// Redux provider with auth state listening
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  // Client-side only code
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Provider store={store}>
      {mounted ? (
        <AuthStateListener>{children}</AuthStateListener>
      ) : (
        // Return placeholder with the same structure to avoid layout shift
        <div className="contents">{children}</div>
      )}
    </Provider>
  );
};
