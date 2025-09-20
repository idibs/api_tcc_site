import express from "express";
import {
  getProduto,
  getProdutos,
  createProduto,
  editProduto,
  deleteProduto,
  getCategorias,
  createUser,
  createEndereco,
  getClientes,
  getIdEndereco,
} from "../database/functions.js";

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

router.get("/produtos", async (_, res) => {
  try {
    const data = await getProdutos();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/produtos/:id", async (req, res) => {
  try {
    const data = await getProduto(req.params.id);
    res.send(data[0]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/produtos", async (req, res) => {
  try {
    const produto = req.body;
    const data = [
      produto.Nome_prod,
      produto.Preco_prod,
      produto.Peso_prod,
      produto.Ml_prod,
      produto.Tipo_prod,
      produto.Quantidade_prod,
      produto.Codigo_prod,
      produto.Foto,
      produto.Id_categ,
    ];
    await createProduto(data);
    res.send("produto criado");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/produtos/:id", async (req, res) => {
  try {
    const produto = req.body;
    const data = [
      produto.Nome_prod,
      produto.Preco_prod,
      produto.Peso_prod,
      produto.Ml_prod,
      produto.Tipo_prod,
      produto.Quantidade_prod,
      produto.Codigo_prod,
      produto.Foto,
      produto.Id_categ,
      req.params.id,
    ];
    await editProduto(data);
    res.send("produto editado");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/produtos/:id", async (req, res) => {
  try {
    await deleteProduto(req.params.id);
    res.send("produto deletado");
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

router.get("/cadastro", async (req, res) => {
  try {
    const data = await getClientes();
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

    await createEndereco(address);
    const Id_end = await getIdEndereco(data.Logradouro_end);
    const user = [data.Nome, data.Email, data.Senha_cli, data.Telefone, Id_end];
    await createUser(user);

    res.send({ message: "Usuário e endereço cadastrados com sucesso!" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
