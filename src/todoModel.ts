import DbAdapter from './dbAdapter';
import MongoAdapter from './mongoAdapter';

const db: DbAdapter = new MongoAdapter()

const getAllTodos = async () => {
  return db.getAllTodos();
};

const addTodo = async (todo) => {
  return db.createOneTodo(todo);
};

const patchTodo = async (id: string, updatedTodo) => {
  return db.updateOneTodo(id, updatedTodo)
};

const deleteTodo = async (id: string) => {
  return db.deleteOneTodo(id)
};

export {
  getAllTodos,
  addTodo,
  deleteTodo,
  patchTodo,
};
