import { Dispatch } from "@reduxjs/toolkit";
import { setUser, setLoading, setError } from "../../state/authSlice";
import { loginUserAction } from "@/app/actions/authActions";

// Login use case - now using the API route
export const loginUser = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(setLoading(true));

      // Call login action
      const user = await loginUserAction(email, password);

      if (!user) {
        throw new Error("User not found after login");
      }

      // Update the auth state
      dispatch(setUser(user));

      return user;
    } catch (error: unknown) {
      dispatch(
        setError(error instanceof Error ? error.message : "Failed to login")
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};
