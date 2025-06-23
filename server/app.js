import cors from 'cors';
import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import { 
  addUser,
  findUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers
} from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, '..')

app.use(express.json());
app.use(cors({
    origin: '*'   //aceita requisições de qualquer porta
}));

app.use(express.static(root + '/client'))

app.get("/check-user", async (req, res) => {  //checa se user existe no banco
  try {
    const { username } = req.query;
    const user = await findUserByUsername(username);
    console.log(`user a checar: ${user}`);

    if (!user) {
      res.status(200).send({
        userExists: false,
      });
    } else {
      res.status(200).send({
        userExists: true,
      });
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao verificar usuário.",
    });
  }
})

app.post("/get-user", async (req, res) => {  //busca dados completos do usuário
  try {
    const { username } = req.body;
    const user = await findUserByUsername(username);
    
    if (!user) {
      res.status(404).send({
        msg: "Usuário não encontrado.",
      });
    } else {
      res.status(200).send([
        user.name,
        user.username,
        user.birthday,
        user.email,
        user.password,
        user.password // para confirmação de senha
      ]);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao buscar usuário.",
    });
  }
})

app.post("/register-account", async (req, res) => {   //registra novo user
  try {
    const existingUser = await findUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send({
        msg: "Usuário já existe.",
      });
    }

    const data = {
      name: req.body.name,
      username: req.body.username,
      birthday: req.body.birthday,
      email: req.body.email,
      password: req.body.password,
      createdAt: new Date()
    };

    const result = await addUser(data);
    
    if (result.success) {
      res.status(200).send({
        msg: "Sucesso ao criar registro.",
        insertedId: result.insertedId,
      });
    } else {
      res.status(500).send({
        msg: "Falha ao criar registro.",
        error: result.error
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao criar registro.",
    });
  }
});

app.post("/login-account", async (req, res) => {  //vê se o login está correto (senha e user batendo)
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    
    if (!user) {
      res.status(200).send({
        userExists: false,
      });
    } else if (user.password === password) {
      res.status(200).send({
        userExists: true,
        user: {
          name: user.name,
          username: user.username,
          email: user.email,
          birthday: user.birthday
        }
      });
    } else {
      res.status(400).send({
        userExists: false,
      });
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      errmsg: "Falha ao fazer login.",
    });
  }
})

app.patch("/edit", async (req, res) => {  //altera / edita user
  try {
    const { id, username, name, birthday, email, password } = req.body;
    const usernameToUpdate = username || id; // aceita tanto id quanto username
    
    const newdata = {
      name: name,
      birthday: birthday,
      email: email,
      password: password,
      updatedAt: new Date()
    };

    const result = await updateUser(usernameToUpdate, newdata);
    
    if (result.success && result.modifiedCount > 0) {
      res.status(200).send({
        msg: "Sucesso ao editar perfil.",
      });
    } else {
      res.status(400).send({
        msg: "Falha ao editar perfil. Usuário não encontrado.",
      });
    }

  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao editar perfil.",
    });
  }
})

// New endpoint to delete user
app.delete("/delete-user", async (req, res) => {
  try {
    const username = req.body.username;
    const result = await deleteUser(username);
    
    if (result.success && result.deletedCount > 0) {
      res.status(200).send({
        msg: "Usuário deletado com sucesso.",
      });
    } else {
      res.status(400).send({
        msg: "Falha ao deletar usuário. Usuário não encontrado.",
      });
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao deletar usuário.",
    });
  }
});

// New endpoint to get all users (for admin purposes)
app.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).send({
      users: users.map(user => ({
        name: user.name,
        username: user.username,
        email: user.email,
        birthday: user.birthday,
        createdAt: user.createdAt
      }))
    });
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao buscar usuários.",
    });
  }
});

app.listen(PORT, () => {
    console.log("Server ouvindo na porta", PORT);
});
