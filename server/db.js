const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://steamrosa:web123@steamrosa.y714tl8.mongodb.net/?retryWrites=true&w=majority&appName=SteamRosa";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB");
  } catch (err) {
    console.error(err);
    }
}

run().catch(console.dir);


let db = client.db('todoapp');
export default db;
