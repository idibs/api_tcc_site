import express from "express";
import {
  getOutrosProdutos,
  getCategorias,
  createEndereco,
  getCereais,
  getEndereco,
  getEnderecos,
  createCliente,
  getClienteIdByNome,
  getCerealIdByNome,
  getOutrosProdutosIdByNome,
  createPedido,
  getClienteEmail,
} from "../database/functions.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

/*

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

router.get("/pedidos", async (req, res) => {
  try {
    const data = await getPedidos()
    res.send(data)
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
})

router.get("/pedidos/:id", async (req, res) => {
  try {
    const data = await getProdutosPedido(req.params.id)
    res.send(data)
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
})

router.post("/pedidos", async (req, res) => {
  try {
    const data = req.body

    // Validação simples
    if (!data.Nome_ped || !data.Id_end || !data.Id_cli) {
      return res.status(400).send({ error: "Nome_ped, Id_end e Id_cli são obrigatórios." });
    }

    const pedido = [data.Nome_ped, data.Id_end, data.Id_cli];
    await insertPedidos(pedido);

    res.status(201).send(pedido);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});*/

router.get("/cereais", async (_, res) => {
  try {
    const data = await getCereais();
    res.send(data);
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
      data.logradouro,
      request.numero,
      data.bairro,
      request.cep,
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
      { expiresIn: "2m" }
    );

    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//vai virar rota privada
router.post("/pedido", async (req, res) => {
  try {
    const request = req.body;

    for (const element of request) {
      const endereco = [
        element.logradouro,
        element.numero,
        element.bairro,
        element.cep,
        element.complemento,
      ];

      let Id_end = await getEndereco(element.cep, element.numero);

      if (!Id_end || Id_end.length === 0) {
        await createEndereco(endereco);
        Id_end = await getEndereco(element.cep, element.numero);
        if (!Id_end || Id_end.length === 0) {
          return res.status(500).send("Erro ao recuperar o endereço");
        }
      }

      const Id_pes = await getClienteIdByNome(element.nome);

      if (!Id_pes || Id_pes.length === 0) {
        return res.status(404).send("Cliente não encontrado");
      }

      let Id_prod = await getCerealIdByNome(element.produto);

      if (!Id_prod || Id_prod.length === 0) {
        Id_prod = await getOutrosProdutosIdByNome(element.produto);
        if (!Id_prod || Id_prod.length === 0) {
          return res.status(404).send("Produto não encontrado");
        }
      }

      const dataAtual = new Date();
      const dataFormatada = dataAtual.toISOString().split("T")[0];
      const valor_total = element.preco * element.quantidade;
      const peso_total = Id_prod[0].Peso * element.quantidade;

      const pedido = [
        Id_pes[0].Id_pes,
        Id_prod[0].Id_ens,
        Id_prod[0].Id_out,
        Id_end[0].Id_end,
        dataFormatada,
        element.quantidade,
        peso_total,
        valor_total,
        element.metodo_pagamento,
      ];

      await createPedido(pedido);
    }

    res.status(201).send("Pedido realizado com sucesso");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
