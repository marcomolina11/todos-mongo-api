import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import DbAdapter from './dbAdapter';
import { Todo } from './model/Todo';

export default class MongoAdapter implements DbAdapter {
  dbClient: MongoClient;

  async connectWithRetry(retries = 5, delay = 3000): Promise<MongoClient> {
    console.log('Initializing the database connection');
    const MONGO_URI =
      process.env.MONGO_URI || 'mongodb://database:27017/testDB';

    if (!MONGO_URI) {
      console.error('MONGO_URI is not defined in the environment variables.');
      process.exit(1);
    }

    for (let i = 0; i < retries; i++) {
      try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        console.log('✅ Connected to MongoDB');
        return client;
      } catch (err) {
        console.error(`❌ Attempt ${i + 1} failed: ${err.message}`);
        if (i < retries - 1) {
          await new Promise((res) => setTimeout(res, delay));
          console.log('🔄 Retrying...');
        } else {
          console.error('❌ All attempts to connect to MongoDB failed.');
          process.exit(1);
        }
      }
    }
  }

  async getDB(): Promise<Db> {
    if (this.dbClient) return this.dbClient.db();

    this.dbClient = await this.connectWithRetry();

    const db = this.dbClient.db();

    if (!db || typeof db.collection !== 'function') {
      console.error('❌ Invalid DB reference');
      process.exit(1);
    }
    return db;
  }

  async getTodosCollection(): Promise<Collection> {
    const db = await this.getDB();
    return db.collection('todos');
  }

  async getAllTodos(): Promise<[]> {
    try {
      const collection = await this.getTodosCollection();
      return (await collection.find({}).toArray()) as [];
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async createOneTodo(todo: Omit<Todo, '_id'>): Promise<string> {
    try {
      const collection = await this.getTodosCollection();
      const result = await collection.insertOne(todo);
      return String(result.insertedId);
    } catch (error) {
      return error;
    }
  }

  async updateOneTodo(
    id: string,
    updatedTodo: Omit<Todo, '_id'>
  ): Promise<object> {
    try {
      const collection = await this.getTodosCollection();
      const result = await collection.findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id) },
        { $set: updatedTodo },
        { returnDocument: 'after' }
      );
      return { ...result, _id: result._id.toHexString() };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteOneTodo(id: string): Promise<void> {
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
    }
  }

  async closeDB(): Promise<void> {
    return this.dbClient?.close();
  }
}
