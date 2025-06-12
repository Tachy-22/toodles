import { Dispatch } from "@reduxjs/toolkit";
import {
  updateTodo as updateTodoDispatch,
  setError,
} from "../../state/todoSlice";
import { updateTodoAction } from "@/app/actions/todoActions";
import { Todo } from "@/domain/entities/Todo";

/**
 * Update Todo Use Case - Simple Explanation
 *
 * What this does: Updates an existing todo item (title, completion status, etc.)
 *
 * Where it's used:
 * - In the TodoItem component when a user edits a todo
 * - When toggling the completion checkbox
 * - Can be called from any component that needs to update a todo
 *
 * How to use it:
 * 1. Import this function
 * 2. Call it with the todo ID and changes: dispatch(updateTodo(todoId, { title: "New title" }))
 * 3. The todo will be immediately updated in the UI
 *
 * This uses optimistic updates:
 * 1. We update the todo in the UI immediately (before server confirms)
 * 2. Then we send the update request to the server in the background
 * 3. If something goes wrong, we show an error message
 */
export const updateTodo = (
  id: string,
  data: { title?: string; completed?: boolean }
) => {
  return async (dispatch: Dispatch) => {
    try {
      // Create a partial todo with just the ID and updated fields
      // Our updated todoSlice can now handle partial updates
      const optimisticUpdate = {
        id,
        ...data,
        updatedAt: new Date().toISOString(), // Update the timestamp locally
      };

      // Optimistically update the todo in the UI immediately
      dispatch(updateTodoDispatch(optimisticUpdate));

      // Update on the server in the background
      const updatedTodo = await updateTodoAction(id, data);

      if (!updatedTodo) {
        throw new Error("Failed to update todo");
      }

      // Update with the server response (which might include additional changes)
      dispatch(updateTodoDispatch(updatedTodo));

      return updatedTodo;
    } catch (error: unknown) {
      // Show error message
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to update todo"
        )
      );

      // We could add rollback logic here if needed

      throw error;
    }
  };
};
