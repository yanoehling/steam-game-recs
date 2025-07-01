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

  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    
    if (!user) {
      res.status(200).send({
        accountExists: false,
      });
    } else if (user.password === password) {
      const token = jwt.sign(user, secret, {
        expiresIn: '1h' ,
        username: user.username,
      });

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
    const {objectId, username, name, birthday, email, password } = req.body;
    
    const newdata = {
      username: username,
      name: name,
      birthday: birthday,
      email: email,
      password: password
    };

    const result = await updateUser(objectId, newdata);
    
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
    const {userId, friendId} = req.body;
    const user = await findUserById(userId);
    const friend = await findUserById(friendId)
    
    if (user && friend){
      const already_added = user.friends.find(f => f.friendId === friendId)
      if (already_added){
        res.status(400).send({
          msg: "Falha ao adicionar amigo. Amigo já adicionado."
        });

      } else {
        user.friends.push({ 
          friendId: friendId, 
          friendUsername: friend.username, 
          recommendations: [] })
        const user_result = await updateUser(userId, { friends: user.friends });
        
        if (user_result.success && user_result.modifiedCount > 0) {
          friend.friends.push({ 
            friendId: userId, 
            friendUsername: user.username, 
            recommendations: [] 
          })
          const friend_result = await updateUser(friendId, { friends: friend.friends });

          if (friend_result.success && friend_result.modifiedCount > 0) {
            res.status(200).send({
              msg: "Sucesso ao adicionar amizade em ambas as contas."
            });
          } else {
            res.status(400).send({
              msg: "Falha ao adicionar amizade no amigo. Amizade adicionada apenas para o user que a pediu.",
              err: friend_result.error
            });
          }
        } else {
          res.status(400).send({
            msg: "Falha ao adicionar amizade.",
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
    const {userId, friendId} = req.body;
    const user = await findUserById(userId);
    const friend = await findUserById(friendId);
    
    if (user && friend){
      console.log("friends:", user.friends)
      const finded = user.friends.find(f => f.friendId === friendId)
      
      if (!finded){
        res.status(400).send({
          msg: "Falha ao remover amigo. Amigo não encontrado nos amigos adicionados."
        });
      }
      // cria um novo array sem o amigo que se quer remover
      console.log("u friends:",  user.friends)
      user.friends.splice(user.friends.findIndex(item => item.friendId === friendId), 1)
      console.log("u new friends:",  user.friends)
      const updated_u_data = { friends: user.friends }; 
      const user_result = await updateUser(userId, updated_u_data);

      if (user_result.success && user_result.modifiedCount > 0) {
        console.log("f friends:",  friend.friends)
        friend.friends.splice(friend.friends.findIndex(item => item.friendId === userId), 1)
        console.log("f new friends:",  friend.friends)
        const updated_f_data = { friends: friend.friends }; 
        const friend_result = await updateUser(friendId, updated_f_data);

        if (friend_result.success && friend_result.modifiedCount > 0) {
          res.status(200).send({
            msg: "Sucesso ao remover amizade."
          });
        } else {
          res.status(400).send({
            msg: "Falha ao remover amizade no amigo. Amizade removida apenas para o user que pediu.",
            err: friend_result.error
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
    const { gameId } = req.query;
    const game = await findGameById(gameId);
    
    if (!game) {
      res.status(404).send({
        msg: "Game não encontrado com este ID."
      });
    } else {
      res.status(200).send([
        game._id,
        game.name,
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
    const {senderId, receiverId, gameId} = req.body;
    const friend_to_receive = await findUserById(receiverId);
    const game = await findGameById(gameId)
    
    if (!friend_to_receive){
      res.status(400).send({
        msg: "Falha ao enviar recomendação. Amigo não existe."
      });
    } else {
      const friends_array = friend_to_receive.friends;
      const sender = friends_array.find(f => f.friendId === senderId);
      if (!sender){
        res.status(400).send({
          msg: "Falha ao enviar recomendação. Amizade ainda não estabelecida."
        });
      } else if (!game){
        res.status(400).send({
          msg: "Falha ao enviar recomendação. Game não encontrado com este ID."
        });
      } else {
        sender.recommendations.push(gameId);
        console.log("recomendação adicionada:", sender);

        const result = await updateUser(receiverId, { friends: friends_array });
        if (result.success && result.modifiedCount > 0) {
          res.status(200).send({
            msg: `Sucesso ao enviar recomendação: ${gameId}`
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
      msg: "Falha ao enviar recomendação.",
      err: err
    });
  }
})


// remove recomendação do amigo
app.patch("/delete-recommendation", async (req, res) => {  
  try {
    const {userId, toDeleteId, gameId} = req.body;
    const user = await findUserById(userId);
    
    if (!user){
      res.status(400).send({
        msg: "User informado não existe."
      });
    } else {
      const friends_array = user.friends;
      const friend_to_remove = friends_array.find(f => f.friendId === toDeleteId);
      if (!friend_to_remove){
        res.status(400).send({
          msg: "Amizade com ID informado ainda foi não estabelecida."
        });
      } else {
        friend_to_remove.recommendations = friend_to_remove.recommendations.filter(f => f !== gameId);
        const result = await updateUser(userId, { friends: friends_array });
        if (result.success && result.modifiedCount > 0) {
          res.status(200).send({
            msg: "Sucesso ao remover recomendação."
          });
        } else {
          res.status(400).send({
          msg: "Falha ao remover recomendação. Recomendação não encontrada.",
          err: result.error
        });
        }
      }
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({
      msg: "Falha ao remover recomendação.",
      err: err
    });
  }
})


app.listen(PORT, () => {
    console.log("Server ouvindo na porta", PORT);
});
