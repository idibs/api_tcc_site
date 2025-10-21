import express from "express";
import {
  getOutrosProdutos,
  getCategorias,
  createEndereco,
  getProdutos,
  getEndereco,
  createCliente,
  getClienteEmail,
  deleteOutrosProdutos,
  deleteProdutosEnsacados,
  getCereaisByIdNome,
  getProdutoById,
  getOutroProdutoById,
  getEnsacados
} from "../database/functions.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/ensacados", async (_, res) => {
  try {
    const data = await getEnsacados();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/cereais", async (_, res) => {
  try {
    const data = await getProdutos();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/produtos/:categoria/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = req.params.categoria;
    let response = {};

    if (categoria == "variedades" || categoria == "rações") {
      response = await getOutroProdutoById(id);
    } else if (categoria == "cereais") {
      response = await getProdutoById(id);
    } else {
      return res.status(500).send("Categoria Obrigatória");
    }

    res.status(200).send(response[0]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/produtos", async (_, res) => {
  try {
    const data = await getOutrosProdutos();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/produtos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const nomeProduto = req.body;

    if (!id) {
      return res.status(500).send("Id necessário");
    }

    const results = await getCereaisByIdNome(id, nomeProduto.nome);

    if (!results || results.length === 0) {
      await deleteOutrosProdutos(id);
    } else {
      await deleteProdutosEnsacados(id);
    }

    res.status(200).send("deletado");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/categorias", async (_, res) => {
  try {
    const data = await getCategorias();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/cadastro", async (req, res) => {
  /*{
  "cep": "",
  "numero": "",
  "complemento": "",
  "nome": "",
  "telefone": "",
  "senha": "",
  "email": ""
}*/
  try {
    const request = req.body;

    // Encriptando a senha com bcrypt
    const senhaEncriptada = await bcrypt.hash(request.senha, 10);

    const cep = request.cep;

    // Usando 'await' para fazer a requisição de forma assíncrona
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!response.ok) {
      return res.status(500).send("Erro ao buscar CEP");
    }

    const data = await response.json();

    const endereco = [
      /*request.localidade,*/
      data.logradouro,
      request.numero,
      data.bairro,
      request.cep,
      data.localidade,
      request.complemento,
    ];

    // Criando o endereço
    let Id_end = await getEndereco(cep, request.numero);

    if (!Id_end || Id_end.length === 0) {
      await createEndereco(endereco);
      Id_end = await getEndereco(cep, request.numero);
      if (!Id_end || Id_end.length === 0) {
        return res.status(500).send("Erro ao recuperar o endereço");
      }
    }

    const cliente = [
      request.nome,
      request.telefone,
      request.email,
      senhaEncriptada,
      Id_end[0].Id_end,
    ];

    // Criando o cliente
    await createCliente(cliente);

    // Resposta de sucesso
    res.status(201).send("Cadastro realizado com sucesso");
  } catch (error) {
    console.error(error); // Log do erro para debug
    res.status(500).send({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const request = req.body;

    if (!request.email || !request.senha) {
      return res.status(400).send("Email e senha são obrigatórios");
    }

    const cliente = await getClienteEmail(request.email);
    if (!cliente || cliente.length === 0) {
      return res.status(404).send("Cliente não encontrado");
    }

    const senhaValida = await bcrypt.compare(
      request.senha,
      cliente[0].Senha_pes
    );
    if (!senhaValida) {
      return res.status(401).send("Senha incorreta");
    }

    const token = jwt.sign(
      {
        id: cliente[0].Id_pes,
        nome: cliente[0].Nome_pes,
        tipo: cliente[0].Tipo_pes,
      },
      JWT_SECRET,
      { expiresIn: "5m" }
    );

    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
