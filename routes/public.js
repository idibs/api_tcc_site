import express from "express";
import { getUser, insertUser } from "../database/functions.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await getUser();
  res.send(data);
});

router.post("/cadastro", async (req, res) => {
  const data = req.body;
  await insertUser(Object.values(data));
  res.status(201).json(data);
  /*
  [
  {
    "Nome_cli": "Nycolas Guedes",
    "Email_cli": "nycolas.guedes@email.com",
    "Senha_cli": "senha321",
    "Id_end": 1
  }
]
   */
});

export default router;
