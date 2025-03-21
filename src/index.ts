import express from 'express';
import cors from 'cors';
import todoRouter from './todoRoutes';
import * as dotenv from 'dotenv';
import { closeDB } from './todoModel';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/todo', todoRouter);

app.listen(port, () => {
  console.log(`Todo api listening on port ${port}`);
});

process.on('SIGINT', async () => {
  await closeDB();
  console.log('DB closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

export default app;
