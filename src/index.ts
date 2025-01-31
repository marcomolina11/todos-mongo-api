import express from 'express';
import cors from 'cors';
import todoRouter from './todoRoutes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/todo', todoRouter);

app.listen(port, () => {
  console.log(`Todo api listening on port ${port}`);
});

export default app;
