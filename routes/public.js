import express from "express";
import {
  getOutrosProdutos,
  getCategorias,
  createEndereco,
  getCereais,
  getEndereco
} from "../database/functions.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

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

router.post('/cadastro', async (req, res) => {
  try {
    const request = req.body;

    //falta bcrypt
    const senhaEncriptada = request.senha

    const cep = request.cep

    /*fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => {
      if (!response.ok) {
        res.status(500).send('erro ao buscar cep');
      }
      return response.json(); // Converte a resposta para JSON
    })
    .then(async (data) => {
      const endereco = [
        data.logradouro,
        request.numero,
        data.bairro,
        request.cep,
        request.complemento
      ];
      await createEndereco(endereco);
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });*/

    const idEndereco = await getEndereco(cep)

    const cliente = [
      request.nome,
      request.telefone,
      request.email,
      senhaEncriptada,
      idEndereco
    ]

    res.send(cliente)


  } catch (error) {
    res.status(500).send({ error: error.message });
  }
})

router.get("/endereco", async (_, res) => {
  try {
    const data = await getEndereco();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
})

export default router;
