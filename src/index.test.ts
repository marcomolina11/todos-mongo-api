import request from 'supertest';
import app from './index';
import { getTodos, addTodo, deleteTodo } from './mongoService';

jest.mock('./mongoService');

describe('Todos API', () => {
  it('should get all todos', async () => {
    const todos = [{ _id: '1', title: 'Test Todo' }];
    (getTodos as jest.Mock).mockResolvedValue(todos);

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(todos);
  });

  it('should add a new todo', async () => {
    const newTodo = { title: 'New Todo' };
    const insertedId = '2';
    (addTodo as jest.Mock).mockResolvedValue(insertedId);

    const response = await request(app).post('/').send(newTodo);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...newTodo, _id: insertedId });
  });

  it('should delete a todo', async () => {
    const todoId = '3';
    (deleteTodo as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).delete(`/${todoId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: `Todo with id ${todoId} deleted successfully`,
    });
  });
});
