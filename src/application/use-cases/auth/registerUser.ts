import { Dispatch } from "@reduxjs/toolkit";
import { setUser, setLoading, setError } from "../../state/authSlice";
import { registerUserAction } from "@/app/actions/authActions";

// Register use case 
export const registerUser = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(setLoading(true));

      // Call the register user action
      const user = await registerUserAction(email, password);

      if (!user) {
        throw new Error("User registration failed");
      }
      // Update the auth state
      dispatch(setUser(user));

      return user;
    } catch (error: unknown) {
      dispatch(
        setError(error instanceof Error ? error.message : "Failed to register")
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};
