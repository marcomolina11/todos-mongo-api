import { addTodo, deleteTodo, getTodos } from './mongoService'

const todoController = {
  getTodos: async (req, res) => {
    try {
      const todos = await getTodos();
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  addTodo: async (req, res) => {
    try {
      const todo = req.body;
      const _id = await addTodo(todo);
      res.status(200).json({ ...todo, _id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteTodo: async (req, res) => {
    try {
      const { id } = req.params;
      await deleteTodo(id);
      res
        .status(200)
        .json({ message: `Todo with id ${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  patchTodo: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTodo = req.body;
      const results = await patchTodo(id, updatedTodo);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

export default todoController;