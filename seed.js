const { MongoClient } = require('mongodb');
const URI = 'mongodb://localhost:27017';
const dbName = 'todosDB';
const collectionName = 'todos';

const seedData = [
  { title: 'Buy groceries', isCompleted: false },
  { title: 'Walk the dog', isCompleted: false },
  { title: 'Do laundry', isCompleted: false },
];

async function seedDB() {
  const client = new MongoClient(URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({});
    console.log('Cleared existing data');

    await collection.insertMany(seedData);
    console.log('Inserted seed data');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Closed connection to MongoDB');
  }
}

seedDB();
