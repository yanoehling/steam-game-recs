MongoClient = require('mongodb').MongoClient

const URI = process.env.MONGODB_URI || ''; //ADICIONAR HTTP MONGO

const client = new MongoClient(URI);

try {
    await client.connect();
    console.log("Conectado ao MongoDB");
} catch (err) {
    console.error(err);
}

let db = client.db('todoapp');

export default db;