import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();
//const collection = db.collection("users");
const collection = ["julio", "yan"];


router.delete("/:id", async (req, res) => {
  try {
    /*let query = {
        _id: new ObjectId(req.params.id)
    }

    let result = await collection.deleteOne(query);*/

    let userName = req.body.userName
    let index = collection.indexOf(userName);
    if (index !== -1) {
        collection.splice(index, 1);
    }

    res.status(200).json({
        modifiedCount: result.modifiedCount,
      });
  } catch (error) {
    console.err(error);
    res.status(500).send({
      errmsg: "Falha ao remover registro",
    });
  }
});

export default router;
