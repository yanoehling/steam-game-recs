import cors from 'cors';
import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
// app.use('/task', tasks);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, '..')

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use(express.static(root + '/frontend'))

//const collection = db.collection("users");
let collection = ["julio", "yan"];

function findUser(username) {
  for (let i = 0; i < collection.length; i++) {
    if (collection[i].username === username) {
      return collection[i]
    }
  }
  return null
}

app.post("/check-user", async (req, res) => {
  try {
    const user = findUser(req.body.username)

    if (!user) {
      res.status(200).send({
        userExists: false,
      })
    } else {
      res.status(200).send({
        userExists: true,
      })
    }
  } catch(error) {
    console.error(error);
    res.status(500).send({
      msg: "Falha ao criar registro.",
    });
  }
})

app.post("/register-account", async (req, res) => {
  try {
    const user = {
        username: req.body.username,
        birthday: req.body.birthday,
        email: req.body.email,
        password: req.body.password,
    };

    //let result = await collection.insertOne(users);
    collection.push(user)
    res.status(200).send({
      msg: "Sucesso ao criar registro.",
      //insertedId: result.insertedId, COLOCAR ISSO QUANDO FIZER O BD DE VERDADE
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      msg: "Falha ao criar registro.",
    });
  }
});

app.post("/login-account", async (req, res) => {
  try {
    const user = findUser(req.body.username)
    if (!user) {
      res.status(200).send({
        userExists: false,
      })
    } else if (user.password === req.body.password) {
      res.status(200).send({
        userExists: true,
      })
    } else {
      res.status(200).send({
        userExists: false,
      })
    }
  } catch(error) {
    console.error(error);
    res.status(500).send({
      errmsg: "Falha ao pegar registro.",
    });
  }
})

app.listen(PORT, () => {
    console.log("Server ouvindo na porta ", PORT);
});