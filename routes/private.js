import express from "express";
import {
  getClienteIdByNome,
  getCerealIdByNome,
  getOutrosProdutosIdByNome,
  getEndereco,
  createPedido,
  createEndereco
} from "../database/functions.js";

const router = express.Router();

router.post("/pedido", async (req, res) => {
  /*{
  "cep": "",
  "numero": "",
  "complemento": "",
  "bairro": "",
  "logradouro": "",
  "nome": "",
  "produto": "",
  "metodo_pagamento": "",
  "preco": ,
  "quantidade": 
}*/
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
      const status = 'Em Orçamento'

      const pedido = [
        Id_pes[0].Id_pes,
        Id_prod[0].Id_ens,
        Id_prod[0].Id_out,
        Id_end[0].Id_end,
        dataFormatada,
        element.quantidade,
        peso_total,
        valor_total,
        status,
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