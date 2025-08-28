import express from "express";
import { getUser, insertUser } from "../database/functions.js";

const router = express.Router();

router.get("/cadastro", async (req, res) => {
  const data = await getUser();
  res.send(data);
});

router.post("/cadastro", async (req, res) => {
  const data = req.body;
  await insertUser(Object.values(data));
  res.status(201).json(data);
});

export default router;
