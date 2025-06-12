import { TodoRepository } from "../../domain/repositories/TodoRepository";
import { Todo } from "../../domain/entities/Todo";
import { todoService } from "../firebase/todoService";

// Firebase implementation of the Todo Repository
export class FirebaseTodoRepo implements TodoRepository {
  async addTodo(todo: Omit<Todo, "id">): Promise<Todo> {
    return todoService.addTodo(todo);
  }

  async getTodos(userId: string): Promise<Todo[]> {
    return todoService.getTodos(userId);
  }

  async getTodoById(id: string): Promise<Todo | null> {
    return todoService.getTodoById(id);
  }

  async updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
    return todoService.updateTodo(id, data);
  }

  async deleteTodo(id: string): Promise<boolean> {
    return todoService.deleteTodo(id);
  }

  async toggleTodoStatus(id: string, completed: boolean): Promise<Todo> {
    return todoService.toggleTodoStatus(id, completed);
  }
}
