import React, { useState } from "react";
import { Todo } from "../../../domain/entities/Todo";
import { TodoItem } from "./TodoItem";
import { TodoForm } from "./TodoForm";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onAddTodo: (title: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, title: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  isLoading,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleUpdateTodo = (title: string) => {
    if (editingTodo) {
      onUpdateTodo(editingTodo.id, title);
      setEditingTodo(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  // Render loading skeletons
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Todos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-40 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Todos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TodoForm onSubmit={onAddTodo} />

        <div className="space-y-2">
          {todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No todos yet. Add one above!
            </div>
          ) : (
            todos.map((todo) =>
              editingTodo?.id === todo.id ? (
                <div key={todo.id} className="mb-2">
                  <TodoForm
                    initialValue={todo.title}
                    onSubmit={handleUpdateTodo}
                    isEditing={true}
                    onCancel={handleCancelEdit}
                  />
                </div>
              ) : (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggleTodo}
                  onDelete={onDeleteTodo}
                  onEdit={handleEditClick}
                />
              )
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
