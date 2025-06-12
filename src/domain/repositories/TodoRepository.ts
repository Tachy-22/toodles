import { Todo } from "../entities/Todo";

/**
 * Repository Pattern 
 * 
 * What is a Repository?
 *
 * Think of a repository as a storage manager for your app's data. It's like a middleman
 * between your application and the database that:
 *
 * 1. Hides the messy details of data storage: Your app doesn't need to know if data
 *    is stored in Firebase, a SQL database, or even just in memory.
 *
 * 2. Provides a clean, consistent way to work with data: Instead of writing database
 *    queries everywhere, you use simple methods like addTodo() or getTodos().
 *
 * 3. Makes testing easier: You can swap the real database with a fake one during tests.
 *
 * 4. Centralizes data access logic: All rules about how to save or retrieve data
 *    are in one place, not scattered throughout the app.
 *
 * In Clean Architecture, the repository interface (this file) lives in the Domain layer,
 * while the actual implementations live in the Infrastructure layer. This separation
 * allows us to change how data is stored without changing the rest of the app.
 *
 * What This TodoRepository Does:
 *
 * This interface defines all the operations our app can perform with todo items:
 * - Adding new todos
 * - Getting a user's todos
 * - Finding a specific todo
 * - Updating a todo
 * - Deleting a todo
 * - Toggling a todo's completion status
 *
 * The actual code that performs these operations with Firebase is in:
 * src/infrastructure/repositories/FirebaseTodoRepo.ts
 */

// Abstract repository interface for Todo operations
export interface TodoRepository {
  // Create a new todo
  addTodo(todo: Omit<Todo, "id">): Promise<Todo>;

  // Get all todos for a specific user
  getTodos(userId: string): Promise<Todo[]>;

  // Get a specific todo by ID
  getTodoById(id: string): Promise<Todo | null>;

  // Update a todo
  updateTodo(id: string, data: Partial<Todo>): Promise<Todo>;

  // Delete a todo
  deleteTodo(id: string): Promise<boolean>;

  // Toggle todo completion status
  toggleTodoStatus(id: string, completed: boolean): Promise<Todo>;
}
