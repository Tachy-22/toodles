"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/application/state/store";
import { TodoList } from "@/presentation/components/todos/TodoList";
import { addTodo } from "@/application/use-cases/todos/addTodo";
import { updateTodo } from "@/application/use-cases/todos/updateTodo";
import { deleteTodo } from "@/application/use-cases/todos/deleteTodo";
import { useToast } from "@/presentation/components/ui/use-toast";

export default function TodosPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: todos, isLoading } = useSelector(
    (state: RootState) => state.todos
  );
  const { toast } = useToast();

  // Add a new todo
  const handleAddTodo = (title: string) => {
    if (user) {
      dispatch(addTodo(user.uid, title))
        .then(() => {
          toast({
            title: "Todo added",
            description: "Your todo has been created successfully",
          });
        })
        .catch((error: unknown) => {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to add todo",
          });
        });
    }
  }; // Toggle a todo's completion status
  const handleToggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      dispatch(updateTodo(id, { completed: !todo.completed })).catch(
        (error: unknown) => {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to update todo",
          });
        }
      );
    }
  }; // Update a todo's title
  const handleUpdateTodo = (id: string, title: string) => {
    dispatch(updateTodo(id, { title }))
      .then(() => {
        toast({
          title: "Todo updated",
          description: "Your todo has been updated successfully",
        });
      })
      .catch((error: unknown) => {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to update todo",
        });
      });
  }; // Delete a todo
  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id))
      .then(() => {
        toast({
          title: "Todo deleted",
          description: "Your todo has been deleted successfully",
        });
      })
      .catch((error: unknown) => {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to delete todo",
        });
      });
  };

  return (
    <div className="flex gap-10 flex-col mx-auto py-10 px-4 max-w-7xl">
      <TodoList
        todos={todos}
        isLoading={isLoading}
        onAddTodo={handleAddTodo}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
        onUpdateTodo={handleUpdateTodo}
      />
    </div>
  );
}
