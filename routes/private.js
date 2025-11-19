import express from "express";
import connection from "../database/connection.js";
import {
  getClienteIdByNome,
  getCerealIdByNome,
  getOutrosProdutosIdByNome,
  getEndereco,
  createPedido,
  createEndereco,
  getEnderecoByNumero,
} from "../database/functions.js";

const router = express.Router();

router.post("/pedido", async (req, res) => {
  /* request: array de objetos conforme seu exemplo */
  const request = req.body;
  const conn = connection();
  try {
    // start transaction
    await new Promise((resolve, reject) =>
      conn.beginTransaction((err) => (err ? reject(err) : resolve()))
    );

    for (const element of request) {
      const endereco = [
        element.logradouro,
        element.numero,
        element.bairro,
        element.cep,
        element.cidade,
        element.complemento,
      ];

      // primeiro tenta por CEP + NUMERO (comportamento antigo)
      let Id_end = await getEndereco(element.cep, element.numero, conn);

      // se não achou por CEP+NUMERO, tenta achar por NUMERO isolado
      if (!Id_end || Id_end.length === 0) {
        const Id_end_por_numero = await getEnderecoByNumero(
          element.numero,
          conn
        );
        if (Id_end_por_numero && Id_end_por_numero.length > 0) {
          // usar o cadastro existente que tinha o mesmo número
          Id_end = Id_end_por_numero;
        } else {
          // se não existir por número, cria
          await createEndereco(endereco, conn);
          Id_end = await getEndereco(element.cep, element.numero, conn);
          if (!Id_end || Id_end.length === 0) {
            throw new Error(
              "Erro ao recuperar o endereço após tentativa de criação"
            );
          }
        }
      }

      const Id_pes = await getClienteIdByNome(element.nome, conn);

      if (!Id_pes || Id_pes.length === 0) {
        throw new Error("Cliente não encontrado");
      }

      let Id_prod = await getCerealIdByNome(element.produto, conn);

      if (!Id_prod || Id_prod.length === 0) {
        Id_prod = await getOutrosProdutosIdByNome(element.produto, conn);
        if (!Id_prod || Id_prod.length === 0) {
          throw new Error("Produto não encontrado");
        }
      }

      const dataAtual = new Date();
      const dataFormatada = dataAtual.toISOString().split("T")[0];
      const valor_total = element.preco * element.quantidade;
      const peso_total = Id_prod[0].Peso * element.quantidade;
      const status =
        element.Status_pedprod === "Em analise" ? "Em analise" : "Em orçamento";

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

      await createPedido(pedido, conn);
    }

    await new Promise((resolve, reject) =>
      conn.commit((err) => (err ? reject(err) : resolve()))
    );
    conn.end();
    res.status(201).send("Pedido realizado com sucesso");
  } catch (error) {
    try {
      await new Promise((resolve, reject) =>
        conn.rollback((err) => (err ? reject(err) : resolve()))
      );
    } catch (rbErr) {
      console.error("Rollback falhou:", rbErr);
    }
    conn.end();
    res.status(500).send({
      error:
        error.message ||
        "Erro ao processar pedido, nenhuma alteração foi salva.",
    });
  }
});

export default router;
