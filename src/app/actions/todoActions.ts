"use server";

import { db } from "@/infrastructure/firebase/config";
import { Todo } from "@/domain/entities/Todo";
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

// Get todos for a specific user (server action)
export async function getTodosAction(userId: string): Promise<Todo[]> {
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
}

// Update a todo (server action)
export async function updateTodoAction(
  id: string,
  data: Partial<Todo>
): Promise<Todo> {
  try {
    const docRef = doc(db, TODOS_COLLECTION, id);

    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) {
      throw new Error("Todo not found");
    }

    return firestoreToTodo(id, updatedDoc.data());
  } catch (error: unknown) {
    console.error("Error updating todo:", error);
    throw new Error(
      `Failed to update todo: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Delete a todo (server action)
export async function deleteTodoAction(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, TODOS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error: unknown) {
    console.error("Error deleting todo:", error);
    throw new Error(
      `Failed to delete todo: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Toggle todo completion status (server action)
export async function toggleTodoStatusAction(
  id: string,
  completed: boolean
): Promise<Todo> {
  return updateTodoAction(id, { completed });
}
