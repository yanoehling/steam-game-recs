import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://steamrosa:web123@steamrosa.y714tl8.mongodb.net/?retryWrites=true&w=majority&appName=SteamRosa";

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
    console.log("Conectado ao MongoDB (Atlas)");
  } catch (err) {
    console.error("Erro ao conectar Mongo:", err.message);
  }
}

run().catch(console.dir);

let db = client.db('todoapp');
const usersCollection = db.collection('users');
const gamesCollection = db.collection('games');

// insere novo user
async function addUser(data) {
  try {
    const result = await usersCollection.insertOne(data);
    return { success: true, insertedId: result.insertedId };
  } catch (err) {
    console.error('Erro ao adicionar user:', err);
    return { success: false, error: err.message };
  }
}

// acha user por username
async function findUserByUsername(username) {
  try {
    const user = await usersCollection.findOne({username: username});
    return user;
  } catch (err) {
    console.error(`Erro ao procurar o user '${username}':`, err);
    return null;
  }
}

// acha user por id
async function findUserById(object_id) {
  try {
    const user = await usersCollection.findOne(object_id);
    return user;
  } catch (err) {
    console.error(`Erro ao procurar o user '${object_id}' :`, err);
    return null;
  }
}

// acha game por id
async function findGameById(object_id) {
  try {
    const game = await gamesCollection.findOne(object_id);
    return game;
  } catch (err) {
    console.error(`Erro ao procurar o game '${object_id}' :`, err);
    return null;
  }
}

// atualiza user
async function updateUser(user_id, data) {
  try {
    const result = await usersCollection.updateOne(
      {_id: user_id},
      {$set: data}
    );
    if (result.deletedCount > 0){
      return {success: true, deletedCount: result.deletedCount};
    } else {throw new Error(`User '${user_id}' não encontrado`)
    }
  } catch (err) {
    console.error(`Erro ao dar update no user '${user_id}':`, err);
    return { success: false, error: err.message };
  }
}

// deleta user
async function deleteUser(username) {
  try {
    const result = await usersCollection.deleteOne({ username: username });
    if (result.deletedCount > 0){
      return {success: true, deletedCount: result.deletedCount};
    } else {throw new Error(`User '${username}' não encontrado`)
    }
  } catch (err) {
    console.error('Erro ao deletar user:', err);
    return {success: false, error: err.message};
  }
}

// pega todos os users
async function getAllUsers() {
  try {
    const users = await usersCollection.find({}).toArray();
    return users;
  } catch (err) {
    console.error('Erro ao pegar todos os users:', err);
    return [];
  }
}

async function getAllGames() {
  try {
    const games = await gamesCollection.find({}).toArray();
    return games;
  } catch (err) {
    console.error('Erro ao pegar todos os games:', err);
    return [];
  }
}



// exporta as funcoes
export {
  db,
  addUser,
  findUserByUsername,
  findUserById,
  findGameById,
  updateUser,
  deleteUser,
  getAllUsers,
  getAllGames
};
