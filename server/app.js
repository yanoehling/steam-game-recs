import cors from 'cors';
import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import { 
  addUser,
  findUserByUsername,
  findUserById,
  findGameById,
  updateUser,
  deleteUser,
  getAllUsers,
  getAllGames
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


app.get("/get-user", async (req, res) => {  //busca dados completos do usuário no db
  try {
    const { username } = req.query;
    const user = await findUserByUsername(username);
    
    if (!user) {
      res.status(404).send({
        msg: "Usuário não encontrado.",
      });
    } else {
      res.status(200).send([
        user._id,
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
      msg: "Falha ao pegar usuário.",
      err: err
    });
  }
})


app.post("/register-account", async (req, res) => {   //registra novo user no db
  try {
    const existingUser = await findUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send({
        msg: "Usuário já existe."
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
        insertedId: result.insertedId
      });
    } else {
      res.status(500).send({
        msg: "Falha ao criar registro.",
        err: result.error
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao criar registro.",
      err: err
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
      err: err
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
        msg: "Sucesso ao editar perfil."
      });
    } else {
      res.status(400).send({
        msg: "Falha ao editar perfil. Usuário não encontrado.",
        err: result.error
      });
    }

  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao editar perfil.",
      err: err
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
        msg: "Usuário deletado com sucesso."
      });
    } else {
      res.status(400).send({
        msg: "Falha ao deletar usuário. Usuário não encontrado.",
        err: result.error
      });
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao deletar usuário.",
      err: err
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
      err: err
    });
  }
});


//adiciona amizade no o user que fez o pedido de amizade e no o amigo desejado
app.patch("/add-friend", async (req, res) => {  
  try {
    const {user_id, friend_id} = req.body;
    const user = await findUserById(user_id);
    const friend = await findUserById(friend_id)
    
    if (user & friend){
      const already_added = user.friends.find(f => f.friendId === friend_id)
      if (already_added){
        res.status(400).send({
          msg: "Falha ao adicionar amigo. Amigo já adicionado."
        });

      } else {
        const user_new_friends = {
          friends: user.friends.push({
            friendId: friend_id, 
            recommendations: []
          })
        }; 
        const friend_new_friends = {
          friends: friend.friends.push({
            friendId: user_id, 
            recommendations: []
          })
        }; 
        const user_result = await updateUser(user_id, user_new_friends);
        
        if (user_result.success && user_result.modifiedCount > 0) {
          const friend_result = await updateUser(friend_id, friend_new_friends);

          if (friend_result.success && friend_result.modifiedCount > 0) {
            res.status(200).send({
              msg: "Sucesso ao adicionar amizade em ambas as contas."
            });
          } else {
            res.status(400).send({
              msg: "Falha ao adicionar amizade no amigo. Amizade adicionada apenas para o user que a pediu.",
              err: result.error
            });
          }
        } else {
          res.status(400).send({
            msg: "Falha ao adicionar amizade."
          });
        }
      }
    } else { 
      res.status(400).send({
          msg: "Falha ao adicionar amizade. Usuário(s) não encontrado(s)."
        });
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao adicionar amizade.",
      err: err
    });
  }
})


//remove amizade no o user que fez o pedido de remoção e no o ex-amigo desejado
app.patch("/delete-friend", async (req, res) => {  
  try {
    const {user_id, friend_id} = req.body;
    const user = findUserById(user_id);
    const friend = findUserById(friend_id);
    
    if (user & friend){
      const finded = user.friends.find(f => f.friendId === friend_id)
      if (!finded){
        res.status(400).send({
          msg: "Falha ao remover amigo. Amigo não encontrado nos amigos adicionados."
        });
      }
      // cria um novo array sem o amigo que se quer remover
      const user_new_friends = user.friends.splice(
        user.friends.findIndex(item => item.friendId === friend_id), 1)
      const friend_new_friends = friend.friends.splice(
        friend.friends.findIndex(item => item.friendId === user_id), 1)

      const updated_u_data = {
        friends: user_new_friends
      }; 
      const user_result = await updateUser(user_id, updated_u_data);

      if (user_result.success && user_result.modifiedCount > 0) {
        const updated_f_data = {
          friends: friend_new_friends
        }; 
        const friend_result = await updateUser(friend_id, updated_f_data);

        if (friend_result.success && friend_result.modifiedCount > 0) {
          res.status(200).send({
            msg: "Sucesso ao remover amizade."
          });
        } else {
          res.status(400).send({
            msg: "Falha ao remover amizade no amigo. Amizade removida apenas para o user que pediu.",
            err: result.error
          });
        }
      } else {
        res.status(400).send({
          msg: "Falha ao remover amizade. Usuário não encontrado."
        });
      }
    } else { 
      res.status(400).send({
          msg: "Falha ao remover amizade. Usuário(s) não encontrado(s)."
        });
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao remover amizade.",
      err: err
    });
  }
})


app.get("/games", async (req, res) => {
  try {
    const games = await getAllGames();
    res.status(200).send({
      games: games.map(game => ({
        id: game._id,
        img: game.img,
        review: game.review,
        description: game.description,
        dev: game.dev,
        category: game.category,
        price: game.price
      }))
    });
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao buscar games.",
      err: err
    });
  }
});


app.get("/get-game", async (req, res) => {  //busca dados completos do game no db
  try {
    const { game_id } = req.query;
    const game = await findGameById(game_id);
    
    if (!game) {
      res.status(404).send({
        msg: "Game não encontrado."
      });
    } else {
      res.status(200).send([
        game._id,
        game.img,
        game.review,
        game.description,
        game.dev,
        game.category,
        game.price
      ]);
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao pegar game.",
      err: err
    });
  }
})


// envia recomendação para o amigo desejado
app.patch("/add-recommendation", async (req, res) => {  
  try {
    const {sender_id, receiver_id, game_id} = req.body;
    const friend_to_receive = await findUserById(receiver_id);
    
    if (!friend_to_receive){
      res.status(400).send({
        msg: "Falha ao enviar recomendação. Amigo não existe."
      });
    } else {
      const friends_array = friend_to_receive.friends;
      const sender = friends_array.find(f => f.friendId === sender_id);
      if (!sender){
        res.status(400).send({
          msg: "Falha ao enviar recomendação. Amizade ainda não estabelecida."
        });
      } else {
        sender.recommendations.push(game_id);
        console.log("recomendação adicionada:", sender);

        const result = await updateUser(receiver_id, { friends: friends_array });
        if (result.success && result.modifiedCount > 0) {
          res.status(200).send({
            msg: "Sucesso ao enviar recomendação."
          });
        } else {
          res.status(400).send({
          msg: "Falha ao enviar recomendação.",
          err: result.error
        });
        }
      }
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao adicionar amizade.",
      err: err
    });
  }
})


// remove recomendação do amigo
app.patch("/remove-recommendation", async (req, res) => {  
  try {
    const {user_id, friend_id, game_id} = req.body;
    const user = await findUserById(user_id);
    
    if (!user){
      res.status(400).send({
        msg: "User informado não existe."
      });
    } else {
      const friends_array = user.friends;
      const friend_to_remove = friends_array.find(f => f.friendId === friend_id);
      if (!friend_to_remove){
        res.status(400).send({
          msg: "Amizade com id informado ainda foi não estabelecida."
        });
      } else {
        friend_to_remove.recommendations.splice(friend_to_remove.recommendations.findIndex(game_id), 1);
        console.log("recomendação removida:", friend_to_remove);

        const result = await updateUser(receiver_id, { friends: friends_array });
        if (result.success && result.modifiedCount > 0) {
          res.status(200).send({
            msg: "Sucesso ao enviar recomendação."
          });
        } else {
          res.status(400).send({
          msg: "Falha ao enviar recomendação.",
          err: result.error
        });
        }
      }
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao adicionar amizade.",
      err: err
    });
  }
})

app.listen(PORT, () => {
    console.log("Server ouvindo na porta", PORT);
});
