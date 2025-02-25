import { MongoClient, ObjectId } from "mongodb";
import DbAdapter from "./dbAdapter";
import { Todo } from "./model/Todo";

const MONGO_URI = process.env.MONGO_URI || "mongodb://database:27017/testDB";
const COLLECTION_NAME = "todos";

export default class MongoAdapter implements DbAdapter {
  dbClient: MongoClient;

  initializeDB() {
    this.dbClient = new MongoClient(MONGO_URI);
  }

  async getTodosCollection() {
    if (!this.dbClient) {
      this.initializeDB();
    }
    await this.dbClient.connect();
    const database = this.dbClient.db();
    return database.collection(COLLECTION_NAME);
  }

  async getAllTodos(): Promise<[]> {
    try {
      const collection = await this.getTodosCollection();
      return (await collection.find({}).toArray()) as [];
    } catch (error) {
      throw new Error(error);
    } finally {
      this.dbClient.close();
    }
  }

  async createOneTodo(todo: Omit<Todo, '_id'>): Promise<string> {
    try {
      const collection = await this.getTodosCollection();
      const result = await collection.insertOne(todo);
      return String(result.insertedId);
    } catch (error) {
      return error;
    } finally {
      this.dbClient.close();
    }
  }

  async updateOneTodo(id: string, updatedTodo: Omit<Todo, '_id'>): Promise<object> {
    try {
      const collection = await this.getTodosCollection();
      const result = await collection.findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id) },
        { $set: updatedTodo },
        { returnDocument: "after" }
      );
      return { ...result, _id: result._id.toHexString() };
    } catch (error) {
      throw new Error(error);
    } finally {
      this.dbClient.close();
    }
  }

  async deleteOneTodo(id: string) {
    try {
      const collection = await this.getTodosCollection();
      const result = await collection.deleteOne({
        _id: ObjectId.createFromHexString(id),
      });
      if (result.deletedCount === 0) {
        throw new Error(`Todo with id ${id} not found`);
      }
      return;
    } catch (error) {
      throw new Error(error);
    } finally {
      this.dbClient.close();
    }
  }
}
