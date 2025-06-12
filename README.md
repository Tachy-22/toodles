# Clean Architecture in Next.js 14: A Practical Guide

## Introduction

In modern web development, creating maintainable, scalable, and testable applications is crucial. Clean Architecture provides a framework for organizing code that maximizes these qualities. This blog post explores how Clean Architecture principles can be applied to a Next.js 14 application, using our Todo app "Toodles" as a practical case study.

## What is Clean Architecture?

Clean Architecture, introduced by Robert C. Martin (Uncle Bob), is a software design philosophy that separates concerns into concentric layers:

![Clean Architecture Diagram](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*yR4C1B-YfMh5zqpbHzTyag.png)

The core principles include:

1. **Independence from frameworks**: The architecture doesn't depend on the existence of some library or framework
2. **Testability**: Business rules can be tested without UI, database, web server, or any external element
3. **Independence from UI**: The UI can change easily without changing the rest of the system
4. **Independence from Database**: Business rules aren't bound to a specific database
5. **Independence from external agencies**: Business rules don't know anything about the outside world

## Clean Architecture in Our Next.js Todo App

Our Next.js 14 Todo application "Toodles" follows these principles through a carefully designed folder structure:

```
/src/
├── domain/               # Enterprise business rules (innermost layer)
├── application/          # Application business rules
├── infrastructure/       # Adapters to external services
├── presentation/         # UI components and page layouts
└── app/                  # Next.js App Router entry points
```

Let's explore each layer using the "adding a todo" feature as a case study.

## 1. Domain Layer: The Core Business Logic

The domain layer contains enterprise-wide business rules and entities. It's the most stable part of our application and has no dependencies on outer layers.

### Todo Entity

Our `Todo` entity defines what a todo item is in our system:

```typescript
// src/domain/entities/Todo.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string; // Store as ISO string for Redux serialization
  updatedAt: string; // Store as ISO string for Redux serialization
}

/**
 * Todo Factory Function - Explained Simply
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
```

Notice that our entity is a plain TypeScript interface with no dependencies on external libraries. It represents a pure business concept.

### Repository Interface

We define abstract interfaces for data access in the domain layer:

```typescript
// src/domain/repositories/TodoRepository.ts
import { Todo } from "../entities/Todo";

/**
 * Repository Pattern - Simple Explanation
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
 */
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
```

This interface defines the contract for todo operations without specifying how they are implemented. This is a core principle of Clean Architecture - the domain doesn't know about the implementation details.

## 2. Application Layer: Use Cases

The application layer contains application-specific business rules and orchestrates the flow of data between the outer layers and the domain layer.

### Add Todo Use Case

```typescript
// src/application/use-cases/todos/addTodo.ts
import { Dispatch } from "@reduxjs/toolkit";
import {
  addTodo as addTodoDispatch,
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
 * - The outer function (addTodo) takes the todo details
 * - The inner function receives the dispatch method from Redux
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
      dispatch(addTodoDispatch(optimisticTodo));

      // Call the add todo action
      const todo = await addTodoAction(optimisticTodo);

      // If the server returned a different ID, update the todo with the server's ID
      if (tempId !== todo.id) {
        dispatch(removeTodo(tempId));
        dispatch(addTodoDispatch(todo));
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
```

The use case orchestrates several operations:

1. Creates a todo entity using the domain's factory function
2. Handles optimistic UI updates (showing the todo before it's saved)
3. Communicates with the infrastructure layer via server actions
4. Updates the Redux store for UI state management
5. Handles errors appropriately

This is where we implement the actual "workflow" of adding a todo, but we don't specify how the todo is stored.

### Redux State Management

Our application layer also includes Redux for managing UI state:

```typescript
// src/application/state/todoSlice.ts (excerpt)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "../../domain/entities/Todo";

export const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    selectedTodo: null,
  },
  reducers: {
    // Add a new todo
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload);
    },
    // Update a todo
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
    // Other reducers...
  },
});
```

Redux manages the application state, allowing components to stay updated with the latest todo information.

## 3. Infrastructure Layer: External Interfaces

The infrastructure layer contains adapters to external services like Firebase:

### Server Actions for Database Operations

```typescript
// src/app/actions/todoActions.ts (excerpt)
"use server";

import { db } from "@/infrastructure/firebase/config";
import { Todo } from "@/domain/entities/Todo";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";

// Constants
const TODOS_COLLECTION = "todos";

// Helper function to convert Firestore data to Todo domain model
const firestoreToTodo = (id: string, data: DocumentData): Todo => {
  return {
    id,
    title: data.title,
    completed: data.completed,
    userId: data.userId,
    createdAt:
      data.createdAt?.toDate().toISOString() || new Date().toISOString(),
    updatedAt:
      data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
  };
};

// Add a new todo (server action)
export async function addTodoAction(todo: Omit<Todo, "id">): Promise<Todo> {
  try {
    const todoData = {
      ...todo,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, TODOS_COLLECTION), todoData);

    return {
      id: docRef.id,
      ...todo,
    };
  } catch (error: unknown) {
    console.error("Error adding todo:", error);
    throw new Error(
      `Failed to add todo: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
```

This server action connects to Firebase to store our todo items. It's important to note that in Next.js 14, server actions provide a clean way to separate server-side code from client-side code.

### Firebase Configuration

```typescript
// src/infrastructure/firebase/config.ts (conceptual)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // other config...
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

Our Firebase configuration is isolated in the infrastructure layer, making it easy to swap out for a different database if needed.

## 4. Presentation Layer: UI Components

The presentation layer contains our React components:

### Todo Form Component

```tsx
// src/presentation/components/todos/TodoForm.tsx (conceptual)
"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "@/application/use-cases/todos/addTodo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoFormProps {
  userId: string;
}

export function TodoForm({ userId }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await dispatch(addTodo(userId, title));
      setTitle("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1"
      />
      <Button type="submit">Add</Button>
    </form>
  );
}
```

This component handles user interaction and dispatches the appropriate use case. It knows nothing about how todos are stored or processed beyond the use case interface.

### Next.js App Router Page

```tsx
// src/app/user/[userId]/todos/page.tsx (conceptual)
import { TodoPage } from "@/presentation/layout/TodoPage";

export default function TodosPage() {
  return <TodoPage />;
}
```

Our Next.js pages are thin wrappers around presentation components, maintaining separation of concerns.

## Benefits of Clean Architecture in Our Next.js App

### 1. Testability

Each layer can be tested in isolation:

- Domain entities can be tested without any external dependencies
- Use cases can be tested with mocked repositories
- UI components can be tested with mocked use cases

### 2. Maintainability

When we need to change something, the change is isolated to a specific layer:

- Need to change the database? Only update the infrastructure layer
- Need to change the UI? Only update the presentation layer
- Need to add business rules? Update the domain layer

### 3. Scalability

As the application grows, the architecture scales well:

- New features follow the same pattern
- New developers can understand where code should go
- Code remains organized even as complexity increases

### 4. Framework Independence

The core business logic is not tied to Next.js or React:

- We could switch to a different frontend framework without changing domain/application logic
- We could build a mobile app using the same domain/application layers

## Optimistic Updates: A Clean Architecture Advantage

Our todo app implements optimistic updates, which provide a better user experience by immediately reflecting changes in the UI before server confirmation:

```typescript
// Optimistically add the todo to the UI immediately
dispatch(addTodoDispatch(optimisticTodo));

// Call the add todo action
const todo = await addTodoAction(optimisticTodo);

// If the server returned a different ID, update the todo with the server's ID
if (tempId !== todo.id) {
  dispatch(removeTodo(tempId));
  dispatch(addTodoDispatch(todo));
}
```

This pattern, implemented in our use cases, shows how Clean Architecture allows us to handle complex workflows while keeping our code organized and maintainable.

## Conclusion

Clean Architecture in Next.js 14 provides a robust framework for building maintainable, testable, and scalable applications. By separating concerns into distinct layers, we can create applications that are easier to understand, modify, and extend.

Our Todo app demonstrates these principles in action, showing how a seemingly simple feature like "adding a todo" can be implemented in a way that maximizes code quality and flexibility.

Whether you're building a small project or a large application, applying Clean Architecture principles can help you create code that stands the test of time.

---

**About Toodles**: Toodles is a Clean Architecture Todo App built with Next.js 14, TypeScript, Redux Toolkit, and Firebase. It demonstrates best practices for organizing code in a modern web application.
#   t o o d l e s  
 