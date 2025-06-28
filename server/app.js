import cors from 'cors';
import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import { 
  addUser,
  findUserByUsername,
  findUserById,
  updateUser,
  deleteUser,
  getAllUsers
} from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, '..')

app.use(express.json());

app.use(cors({
    origin: '*'   //aceita requisições de qualquer porta
}));

app.use(express.static(root + '/client'))


app.get("/check-user", async (req, res) => {  //checa se user existe no db
  try {
    const { username } = req.query;
    const user = await findUserByUsername(username);

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
      msg: `Falha ao verificar usuário.`,
    });
  }
})

app.post("/")


app.post("/get-user", async (req, res) => {  //busca dados completos do usuário no db
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
        user.friends
      ]);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao buscar usuário.",
    });
  }
})


app.post("/register-account", async (req, res) => {   //registra novo user no db
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
      friends: []
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


app.post("/login-account", async (req, res) => {  //vê se senha e user correspondem no db
  const secret = 'TRABALHO_YAN_PATRICK_RAIDEN_JULIO_WEB_2025_1';
  const options = {
    expiresIn: '1h' // expira em 1 hora
  };

  const token = jwt.sign(payload, secret, options);

  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    
    if (!user) {
      res.status(200).send({
        accountExists: false,
      });
    } else if (user.password === password) {
      res.status(200).send({
        accountExists: true,
        user: {
          name: user.name,
          username: user.username,
          email: user.email,
          birthday: user.birthday,
          friends: user.friends,
        },
        jwt: token,
      });
    } else {
      res.status(400).send({
        accountExists: false,
      });
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao fazer login.",
    });
  }
})


app.patch("/edit-account", async (req, res) => {  //altera  user no db
  try {
    const {object_id, username, name, birthday, email, password } = req.body;
    
    const newdata = {
      username: username,
      name: name,
      birthday: birthday,
      email: email,
      password: password
    };

    const result = await updateUser(object_id, newdata);
    
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
});

// deleta user no db
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

// pega todos users no db
app.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).send({
      users: users.map(user => ({
        name: user.name,
        username: user.username,
        email: user.email,
        birthday: user.birthday,
        friends: user.friends
      }))
    });
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao buscar usuários.",
    });
  }
});


app.patch("/add-friend", async (req, res) => {  //altera / edita user no db
  try {
    const {user_id, friend_id} = req.body;
    const user = await findUserById(user_id);
    const friend = await findUserById(friend_id)
    
    if (user & friend){
      const friend_ids_array = user.friends.map(f => f.friendId);
      if (friend_ids_array.includes(friend_id)){
        res.status(400).send({
          msg: "Falha ao adicionar amigo. Amigo já adicionado.",
        });

      } else {
        const new_friends = {
          friends: user.friends.push({
            friendId: friend_id, 
            recommendations: []
          })
        }; 
        const result = await updateUser(user_id, new_friends);
        
        if (result.success && result.modifiedCount > 0) {
          res.status(200).send({
            msg: "Sucesso ao adicionar amigo.",
          });
        } else {
          res.status(400).send({
            msg: "Falha ao adicionar amigo.",
          });
        }
      }
    } else { 
      res.status(400).send({
          msg: "Falha ao adicionar amigo. Usuário(s) não encontrado(s).",
        });
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao adicionar amigo.",
    });
  }
})


app.patch("/delete-friend", async (req, res) => {  //altera / edita user no db
  try {
    const {user_id, friend_id} = req.body;
    const user = findUserById(user_id);
    const friend = findUserById(friend_id);
    
    if (user & friend){
      const friend_ids = user.friends.map(f => f.friendId);
      if (friend_ids.includes(user_id) == false){
        res.status(400).send({
          msg: "Falha ao remover amigo. Amigo não encontrado nos amigos adicionados."
        });
      }
      // cria um novo array sem o amigo que se quer remover
      const new_friends = user.friends.splice(
        user.friends.findIndex(item => item.friendId === friend_id), 1)
      const updated_data = {
        friends: new_friends
      }; 
      const result = await updateUser(user_id, updated_data);
      
      if (result.success && result.modifiedCount > 0) {
        res.status(200).send({
          msg: "Sucesso ao remover amigo."
        });
      } else {
        res.status(400).send({
          msg: "Falha ao remover amigo. Usuário não encontrado."
        });
      }
    } else { 
      res.status(400).send({
          msg: "Falha ao remover amigo. Usuário(s) não encontrado(s)."
        });
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao remover amigo."
    });
  }
})




app.listen(PORT, () => {
    console.log("Server ouvindo na porta", PORT);
});
