import { Dispatch } from "@reduxjs/toolkit";
import {
  deleteTodo as deleteTodoDispatch,
  setError,
  // Add this for potential rollback
  addTodo as addTodoDispatch,
} from "../../state/todoSlice";
import { deleteTodoAction } from "@/app/actions/todoActions";
import { Todo } from "@/domain/entities/Todo";

/**
 * Delete Todo Use Case - Simple Explanation
 *
 * What this does: Removes a todo item from the database
 *
 * Where it's used:
 * - In the TodoItem component when a user clicks the delete button
 * - Can be called from any component that needs to delete a todo
 *
 * How to use it:
 * 1. Import this function
 * 2. Call it with the todo ID: dispatch(deleteTodo(todoId))
 * 3. The todo will be immediately removed from the UI
 *
 * This uses optimistic updates:
 * 1. We remove the todo from the UI immediately (before server confirms)
 * 2. Then we send the delete request to the server in the background
 * 3. If something goes wrong, we show an error message
 */
export const deleteTodo = (id: string, todo?: Todo) => {
  return async (dispatch: Dispatch) => {
    try {
      // Optimistically delete the todo from the UI immediately
      dispatch(deleteTodoDispatch(id));

      // Delete from the server in the background
      const isDeleted = await deleteTodoAction(id);

      if (!isDeleted) {
        throw new Error("Failed to delete todo");
      }

      return true;
    } catch (error: unknown) {
      // Show error message
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to delete todo"
        )
      );

      // Optional: Restore the todo if we have it and the deletion failed
      // This provides a better user experience
      if (todo) {
        dispatch(addTodoDispatch(todo));
      }

      throw error;
    }
  };
};
