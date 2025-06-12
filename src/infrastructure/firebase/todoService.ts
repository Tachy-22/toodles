import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import { Todo } from "../../domain/entities/Todo";

// Constants
const TODOS_COLLECTION = "todos";

// Helper function to convert Firestore data to Todo domain model
const firestoreToTodo = (id: string, data: DocumentData): Todo => {
  return {
    id,
    title: data.title as string,
    completed: data.completed as boolean,
    userId: data.userId as string,
    createdAt:
      data.createdAt instanceof Timestamp
        ? (data.createdAt as Timestamp).toDate().toISOString()
        : new Date().toISOString(),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? (data.updatedAt as Timestamp).toDate().toISOString()
        : new Date().toISOString(),
  };
};

// Firebase Firestore Todo Service
export const todoService = {
  // Add a new todo
  async addTodo(todo: Omit<Todo, "id">): Promise<Todo> {
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
  },
  // Get todos for a specific user
  async getTodos(userId: string): Promise<Todo[]> {
    try {
      const q = query(
        collection(db, TODOS_COLLECTION),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const todos: Todo[] = [];

      querySnapshot.forEach((doc) => {
        todos.push(firestoreToTodo(doc.id, doc.data()));
      });

      return todos;
    } catch (error: unknown) {
      console.error("Error fetching todos:", error);
      throw new Error(
        `Failed to fetch todos: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  // Get a specific todo by ID
  async getTodoById(id: string): Promise<Todo | null> {
    const docRef = doc(db, TODOS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return firestoreToTodo(docSnap.id, docSnap.data());
  },

  // Update a todo
  async updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
    const docRef = doc(db, TODOS_COLLECTION, id);

    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    return firestoreToTodo(id, updatedDoc.data() as DocumentData);
  },

  // Delete a todo
  async deleteTodo(id: string): Promise<boolean> {
    const docRef = doc(db, TODOS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  },

  // Toggle todo completion status
  async toggleTodoStatus(id: string, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  },
};
