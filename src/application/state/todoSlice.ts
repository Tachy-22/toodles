import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "../../domain/entities/Todo";

// Define the state type for todos
interface TodoState {
  items: Todo[];
  isLoading: boolean;
  error: string | null;
  selectedTodo: Todo | null;
}

// Initial state
const initialState: TodoState = {
  items: [],
  isLoading: false,
  error: null,
  selectedTodo: null,
};

// Create the todos slice
export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // Set all todos
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    // Add a new todo
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload);
    },
    // Remove a todo by id (for optimistic updates)
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    }, // Update a todo
    updateTodo: (
      state,
      action: PayloadAction<Partial<Todo> & { id: string }>
    ) => {
      const index = state.items.findIndex(
        (todo) => todo.id === action.payload.id
      );
      if (index !== -1) {
        // Merge the existing todo with the updates
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          // Make sure updatedAt is always updated
          updatedAt: action.payload.updatedAt || new Date().toISOString(),
        };
      }
    },
    // Delete a todo
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
    // Toggle a todo's completion status
    toggleTodoStatus: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        state.items[index].completed = !state.items[index].completed;
      }
    },
    // Set the selected todo
    setSelectedTodo: (state, action: PayloadAction<Todo | null>) => {
      state.selectedTodo = action.payload;
    },
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    // Clear todos (e.g., on logout)
    clearTodos: (state) => {
      state.items = [];
      state.selectedTodo = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

// Export actions
export const {
  setTodos,
  addTodo,
  removeTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
  setSelectedTodo,
  setLoading,
  setError,
  clearTodos,
} = todoSlice.actions;

// Export reducer
export default todoSlice.reducer;
