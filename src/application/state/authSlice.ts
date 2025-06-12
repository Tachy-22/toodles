import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../domain/entities/User";

// Define the state type for authentication
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create the auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set the current user
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.error = null;
    },
    // Set the loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    // Clear any error
    clearError: (state) => {
      state.error = null;
    },
    // Reset state (logout)
    resetState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

// Export actions
export const { setUser, setLoading, setError, clearError, resetState } =
  authSlice.actions;

// Export reducer
export default authSlice.reducer;
