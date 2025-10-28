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
  getEnsacados,
  getEnsacadosPeso,
  getClienteByTelefone,
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

router.get("/ensacados/preco", async (req, res) => {
  try {
    const id_prod = req.body.id;
    response = await getEnsacadosPeso(id);
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
  /* esperado (campos opcionais):
  {
    "cep": "01001000",
    "numero": "123",
    "complemento": "Apto 1",
    "nome": "Nome Cliente",
    "telefone": "5511999999999",
    "senha": "opcional",
    "email": "opcional@ex.com"
  }
  */
  try {
    const request = req.body || {};

    const nome = (request.nome || "").trim();
    const telefone = (request.telefone || "").trim();
    const cep = (request.cep || "").trim();
    const numero = (request.numero || "").trim();
    const complemento = (request.complemento || "").trim();
    const email =
      request.email && String(request.email).trim() !== ""
        ? request.email
        : null;

    if (!nome || !telefone) {
      return res
        .status(400)
        .send({ error: "nome e telefone são obrigatórios" });
    }

    // Verifica se já existe cliente (ajuste getClienteByTelefone conforme sua implementação)
    let existing = null;
    try {
      existing = await getClienteByTelefone(telefone);
    } catch (err) {
      console.error("Erro ao checar cliente existente:", err);
    }

    if (existing && existing.length > 0) {
      return res.status(200).send({
        message: "Cliente já existe",
        clienteId: existing[0].Id_cli || null,
      });
    }

    // Busca dados do CEP (se informado)
    let cepData = null;
    if (cep) {
      try {
        const responseCep = await fetch(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        if (responseCep && responseCep.ok) {
          cepData = await responseCep.json();
        }
      } catch (e) {
        // não fatal — seguimos com nulls
        console.warn(
          "Falha ao consultar viacep:",
          e && e.message ? e.message : e
        );
      }
    }

    const endereco = [
      cepData ? cepData.logradouro : null,
      numero || null,
      cepData ? cepData.bairro : null,
      cep || null,
      cepData ? cepData.localidade : null,
      complemento || null,
    ];

    let Id_end = await getEndereco(cep, numero);
    if (!Id_end || Id_end.length === 0) {
      await createEndereco(endereco);
      Id_end = await getEndereco(cep, numero);
      if (!Id_end || Id_end.length === 0) {
        return res.status(500).send({ error: "Erro ao recuperar o endereço" });
      }
    }

    // SENHA: se fornecida, encripta; caso contrário, guarda NULL
    let senhaEncriptada = null;
    if (request.senha && String(request.senha).trim() !== "") {
      senhaEncriptada = await bcrypt.hash(String(request.senha), 10);
    } else {
      senhaEncriptada = null; // explicitamente NULL
    }

    const cliente = [
      nome,
      telefone,
      email, // já é null quando não enviado
      senhaEncriptada, // null se não veio
      Id_end[0].Id_end,
    ];

    await createCliente(cliente);

    return res.status(201).send({ message: "Cliente criado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error.message || "Erro interno" });
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
