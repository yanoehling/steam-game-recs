import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();
//const collection = db.collection("users");
const collection = ["julio", "yan"];



router.post("/", async (req, res) => {
  try {
    let user = {
        completeName: req.body.completeName,
        userName: req.body.userName,
        dateOfBirth: req.body.dateOfBirth,
        email: req.body.email,
        password: req.body.password,
    };

    //let result = await collection.insertOne(users);
    let result = collection.push()
    res.status(200).send({
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.err(error);
    res.status(500).send({
      errmsg: "Falha ao criar registro.",
    });
  }
});


export default router;
