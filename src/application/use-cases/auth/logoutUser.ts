import { Dispatch } from "@reduxjs/toolkit";
import { resetState, setLoading, setError } from "../../state/authSlice";
import { clearTodos } from "../../state/todoSlice";
import { logoutUserAction } from "@/app/actions/authActions";

// Logout use case - now using the API route
export const logoutUser = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(setLoading(true));

      // Call the logout action
      await logoutUserAction();

      // Reset the auth and todo states
      dispatch(resetState());
      dispatch(clearTodos());
    } catch (error: unknown) {
      dispatch(
        setError(error instanceof Error ? error.message : "Failed to logout")
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
};
