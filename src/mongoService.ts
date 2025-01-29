const { MongoClient } = require('mongodb');

let dbClient;
const URI = 'mongodb://localhost:27017';

function initializeDB() {
  dbClient = new MongoClient(URI);
}

async function getTodosCollection() {
  if (!dbClient) {
    initializeDB();
  }
  await dbClient.connect();
  const database = dbClient.db('todosDB');
  return database.collection('todos');
}

module.exports.getTodos = async () => {
  try {
    const collection = await getTodosCollection();
    return await collection.find({}).toArray();
  } catch (error) {
    return error;
  } finally {
    dbClient.close();
  }
};

module.exports.addTodo = async (todo) => {
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
