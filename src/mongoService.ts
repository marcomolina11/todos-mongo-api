import { MongoClient, ObjectId } from 'mongodb';

let dbClient: MongoClient;
const URI = 'mongodb://localhost:27017';
const dbName = 'todosDB';
const collectionName = 'todos';

function initializeDB() {
  dbClient = new MongoClient(URI);
}

async function getTodosCollection() {
  if (!dbClient) {
    initializeDB();
  }
  await dbClient.connect();
  const database = dbClient.db(dbName);
  return database.collection(collectionName);
}

const getTodos = async () => {
  try {
    const collection = await getTodosCollection();
    return await collection.find({}).toArray();
  } catch (error) {
    return error;
  } finally {
    dbClient.close();
  }
};

const addTodo = async (todo) => {
  try {
    const collection = await getTodosCollection();
    const result = await collection.insertOne(todo);
    return result.insertedId;
  } catch (error) {
    return error;
  } finally {
    dbClient.close();
  }
};

const deleteTodo = async (id: string) => {
  try {
    const collection = await getTodosCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new Error(`Todo with id ${id} not found`);
    }
    return;
  } catch (error) {
    throw new Error(error);
  } finally {
    dbClient.close();
  }
};

const patchTodo = async (id: string, updatedTodo) => {
  try {
    const collection = await getTodosCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedTodo },
      { returnDocument: 'after' }
    );
    return { ...result, _id: result._id.toHexString() };
  } catch (error) {
    throw new Error(error);
  } finally {
    dbClient.close();
  }
};

export {
  getTodos,
  addTodo,
  deleteTodo,
  patchTodo,
  getTodosCollection,
  dbClient,
};
