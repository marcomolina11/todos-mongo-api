import { Todo } from "./model/Todo";

export default interface DbAdapter {
  getAllTodos: () => Promise<[]>,
  createOneTodo: (todo: Omit<Todo, '_id'>) => Promise<string>,
  updateOneTodo: (id: string, updatedTodo: Omit<Todo, '_id'>) => Promise<object>,
  deleteOneTodo: (id: string) => void,
}