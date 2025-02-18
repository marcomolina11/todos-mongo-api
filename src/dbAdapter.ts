export default interface DbAdapter {
  getAllTodos: () => Promise<[]>,
  createOneTodo: (todo: {}) => Promise<string>,
  updateOneTodo: (id: string, updatedTodo: {}) => Promise<{}>,
  deleteOneTodo: (id: string) => void,
}