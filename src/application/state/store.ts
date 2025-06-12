import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import todoReducer from "./todoSlice";

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredActions: ["auth/setUser"],
        ignoredPaths: [
          "auth.user.createdAt",
          "todos.items.createdAt",
          "todos.items.updatedAt",
        ],
      },
    }),
});

// Export types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
