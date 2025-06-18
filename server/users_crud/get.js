import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";


const router = express.Router();
//const collection = db.collection("users");
const collection = ["julio", "yan"];

router.get("/", async (req, res) => {
  try {
    let user = req.body
    //let results = await collection.find({}).toArray();
    let results = collection.find(user.userName);
    console.log(`Usuario ${userName} retornado`)
    res.status(200).send(results);

  } catch (error) {
    console.err(error);
    res.status(500).send({
      errmsg: "Falha ao retornar registros",
    });
  }
});

export default router;
