import React from "react";
import { Todo } from "../../../domain/entities/Todo";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Trash2, Edit2 } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  return (
    <div className="flex items-center justify-between p-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center gap-3">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={handleToggle}
          className="display-hidden"
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`text-sm font-medium ${
            todo.completed
              ? "line-through text-gray-500 dark:text-gray-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {todo.title}
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleEdit}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};
