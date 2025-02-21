import express from "express";
import cors from "cors";
import todoRouter from "./todoRoutes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/todo", todoRouter);

app.listen(port, () => {
  console.log(`Todo api listening on port ${port}`);
});

export default app;
