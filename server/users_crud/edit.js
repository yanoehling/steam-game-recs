import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";


const router = express.Router();
const collection = db.collection("users");

router.patch("/:id", async (req, res) => {
  try {
    let query = {
      _id: new ObjectId(req.params.id),
    };
    let user = {
        completeName: req.body.completeName,
        userName: req.body.userName,
        dateOfBirth: req.body.dateOfBirth,
        email: req.body.email,
        password: req.body.password,
    };

    let result = await collection.updateOne(query, { $set: user });

    res.status(200).json({
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.err(error);
    res.status(500).send({
      errmsg: "Falha ao atualizar registro",
    });
  }
});

export default router;
