import express from 'express';
import { getTodos, addTodo } from './mongoService';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const todos = await getTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/', async (req, res) => {
  try {
    const todo = req.body;
    const _id = await addTodo(todo);
    res.status(200).json({ ...todo, _id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Todo api listening on port ${port}`);
});
