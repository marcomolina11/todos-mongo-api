import todoController from "./todoController";

jest.mock("./todoModel", () => ({
  getAllTodos: jest.fn(),
  addTodo: jest.fn(),
  deleteTodo: jest.fn(),
  patchTodo: jest.fn(),
}));

import { getAllTodos } from "./todoModel";

describe("Todo Controller", () => {
  it("should get all todos", async () => {
    (getAllTodos as jest.Mock).mockResolvedValue(
      Promise.resolve([{ _id: "1", title: "Test Todo" }])
    );

    const mockTodos = [{ _id: "1", title: "Test Todo" }];
    const spyRequest = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await todoController.getTodos({}, spyRequest);
    expect(spyRequest.status).toHaveBeenCalledWith(200);
    expect(spyRequest.json).toHaveBeenCalledWith(mockTodos);
  });

  it("should handle get all todos error", async () => {
    (getAllTodos as jest.Mock).mockRejectedValue(new Error("Error getting todos"));

    const spyRequest = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await todoController.getTodos({}, spyRequest);
    expect(spyRequest.status).toHaveBeenCalledWith(500);
    expect(spyRequest.json).toHaveBeenCalledWith({
      error: "Error getting todos",
    });
  });
});
