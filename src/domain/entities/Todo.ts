// Domain entity for Todo
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string; // Store as ISO string for Redux serialization
  updatedAt: string; // Store as ISO string for Redux serialization
}

/**
 * Todo Factory Function - Explained 
 *
 * Think of this as a "Todo maker" - it's like a factory that makes Todo items.
 *
 * In Clean Architecture, we want to keep our code organized and separated into layers:
 *
 * 1. What it does: This function creates new Todo items with all the right information.
 *
 * 2. Why it's useful: It puts all the Todo creation logic in one place, so we don't
 *    have to write the same code over and over again.
 *
 * 3. How it helps: It automatically sets the dates, handles defaults, and makes sure
 *    every Todo has the same structure.
 *
 * 4. Special feature: It converts dates to text strings so Redux can store them
 *    without errors (Redux can't store Date objects directly).
 *
 * 5. No ID included: We don't create an ID here because Firebase will give us one
 *    when we save the Todo to the database.
 *
 * Simply put: This function is like a cookie cutter that ensures all our Todos
 * are created the same way, with the right information, every time.
 */

export const createTodo = (
  userId: string,
  title: string,
  completed: boolean = false
): Omit<Todo, "id"> => {
  const now = new Date().toISOString(); // Convert to ISO string for Redux serialization

  return {
    title,
    completed,
    userId,
    createdAt: now,
    updatedAt: now,
  };
};
