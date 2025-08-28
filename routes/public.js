import express from "express";
import { getUser, insertUser, insertAdress, getAdressId } from "../database/functions.js";

const router = express.Router();

router.get("/cadastro", async (req, res) => {
  const data = await getUser();
  res.send(data);
});

router.post("/cadastro", async (req, res) => {
  const data = req.body;
  const user = [
    data.Nome_cli, 
    data.Email_cli, 
    data.Senha_cli
  ]
  const adress = [
    data.Logradouro_end, 
    data.Numero_end, 
    data.Bairro_end, 
    data.Cep_end, 
    data.Complemento_end]
  await insertAdress(adress)
  
  res.send(Id_End)
});

export default router;
