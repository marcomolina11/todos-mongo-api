import request from "supertest";
import app from "./index";
import todoController from "./todoController";

jest.mock("./todoController", () => ({
  getTodos: jest.fn((req, res) => res.status(200).json([])),
  addTodo: jest.fn((req, res) => res.status(201).json({ id: 1, ...req.body })),
  deleteTodo: jest.fn((req, res) => res.status(204).end()),
  patchTodo: jest.fn((req, res) =>
    res.status(200).json({ id: req.params.id, ...req.body })
  ),
}));

describe("Todo Routes", () => {
  it("should get all todos", async () => {
    const response = await request(app).get("/todo");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should add a new todo", async () => {
    const newTodo = { title: "Test Todo" };
    const response = await request(app).post("/todo").send(newTodo);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 1, ...newTodo });
  });

  it("should delete a todo", async () => {
    const response = await request(app).delete("/todo/1");
    expect(response.status).toBe(204);
  });

  it("should update a todo", async () => {
    const updatedTodo = { title: "Updated Todo" };
    const response = await request(app).patch("/todo/1").send(updatedTodo);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "1", ...updatedTodo });
  });
});
