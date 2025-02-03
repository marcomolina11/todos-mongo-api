import DbAdapter from "./dbAdapter";

export default class PostgresAdapter implements DbAdapter {
  async getAllTodos(): Promise<[]>{
    return []
  }
  async createOneTodo(): Promise<string> {
    return ''
  }
  async updateOneTodo(id: string, updatedTodo: {}): Promise<{}> {
    return {}
  }
  async deleteOneTodo(id: string) {}

}