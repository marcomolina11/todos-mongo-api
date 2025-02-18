import todoController from "./todoController";

jest.mock("./mongoService", () => ({
  getTodos: jest.fn(),
  addTodo: jest.fn(),
  deleteTodo: jest.fn(),
  patchTodo: jest.fn(),
}));

import { getTodos } from "./mongoService";

describe("Todo Controller", () => {
  it("should get all todos", async () => {
    (getTodos as jest.Mock).mockResolvedValue(
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
    (getTodos as jest.Mock).mockRejectedValue(new Error("Error getting todos"));

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
