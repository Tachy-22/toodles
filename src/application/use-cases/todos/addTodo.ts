import { Dispatch } from "@reduxjs/toolkit";
import {
  addTodo as addDispatchTodo,
  removeTodo,
  setError,
} from "../../state/todoSlice";
import { createTodo } from "../../../domain/entities/Todo";
import { v4 as uuidv4 } from "uuid";
import { addTodoAction } from "@/app/actions/todoActions";

/**
 * Add Todo Use Case - Simple Explanation
 *
 * What this does: Creates and saves a new todo item
 *
 * Where it's used:
 * - In the TodoPage component when a user submits a new todo form
 *
 * How to use it:
 * 1. Import this function
 * 2. Call it with the user ID and todo title: dispatch(addTodo(userId, "My new task"))
 * 3. The function handles everything else automatically!
 *
 * Why is it wrapped in dispatch?
 * - This is a "Redux Thunk" pattern - a function that returns another function
 * - It allows us to perform async operations (like API calls) in Redux
 * - This way, we can dispatch multiple actions during the process:
 *   • First to add the optimistic todo to the UI
 *   • Then to remove it if there's an error
 *   • Or to update it with the server version
 *   • Or to show an error message
 *
 * Here's how it works:
 *
 * 1. Show First, Save Later: We immediately show the new todo in the list
 *    (like when you add something to a shopping cart, it appears right away).
 *    This is called "optimistic updating" - we're optimistic that saving will work!
 *
 * 2. Make a Temporary Todo: We create a temporary todo with a made-up ID and
 *    show it on the screen right away.
 *
 * 3. Save it for Real: In the background, we send the todo to our database
 *    through an API call.
 *
 * 4. Handle What Happens Next:
 *    - If saving fails: We remove the temporary todo from the screen and show an error
 *    - If saving works: We replace the temporary todo with the real one from the server
 *      (which has a different ID)
 *
 * This approach makes the app feel faster and more responsive to users!
 */

export const addTodo = (userId: string, title: string) => {
  return async (dispatch: Dispatch) => {
    try {
      // Create a temporary ID for optimistic rendering
      const tempId = uuidv4();

      // Create a new todo domain object with temporary ID
      const optimisticTodo = {
        ...createTodo(userId, title),
        id: tempId,
      };

      // Optimistically add the todo to the UI immediately
      dispatch(addDispatchTodo(optimisticTodo));

      // Call the add todo action
      const todo = await addTodoAction(optimisticTodo);

      // If the server returned a different ID, update the todo with the server's ID
      if (tempId !== todo.id) {
        dispatch(removeTodo(tempId));
        dispatch(addDispatchTodo(todo));
      }
      return todo;
    } catch (error: unknown) {
      dispatch(
        setError(error instanceof Error ? error.message : "Failed to add todo")
      );
      throw error;
    }
  };
};
