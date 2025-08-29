import express from "express";
import { getUsers, insertUser, insertAddress, getAddressId } from "../database/functions.js";

const router = express.Router();

router.get("/cadastro", async (req, res) => {
  try {
    const data = await getUsers();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/cadastro", async (req, res) => {
  try {
    const data = req.body;

    const address = [
      data.Logradouro_end,
      data.Numero_end,
      data.Bairro_end,
      data.Cep_end,
      data.Complemento_end,
    ];

    await insertAddress(address);

    const Id_end = await getAddressId(data.Logradouro_end);

    const user = [
      data.Nome_cli,
      data.Email_cli,
      data.Senha_cli,
      Id_end,
    ];

    await insertUser(user);

    res.send({ message: "Usuário e endereço cadastrados com sucesso!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;