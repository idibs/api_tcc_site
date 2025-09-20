import connection from "./connection.js";

/*



export function getPedidos() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Pedido`;
    conn.query(sql, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getProdutosPedido(Id_ped) {
  const conn = connection();
  const query = `
    SELECT Quantidade_pedprod, Subtotal_pedprod, Nome_prod, Preco_prod
    FROM Pedido_produto Ped
    INNER JOIN Produto P ON P.Id_prod = Ped.Id_prod
    WHERE Ped.Id_ped = ?
  `;
  return new Promise((resolve, reject) => {
    conn.query(query, [Id_ped], (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function insertPedidos(data) {
  const conn = connection();
  const query = `
    INSERT INTO Pedido (Nome_ped, Data_ped, Valor_total_ped, Status_ped, Id_end, Id_cli)
    VALUES (?, NOW(), NULL, 'em orçamento', ?, ?)
  `;
  return new Promise((resolve, reject) => {
    conn.query(query, data, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}*/
export function getIdEndereco(Logradouro_end) {
  const conn = connection();
  const query = `SELECT Id_end FROM Endereco WHERE Logradouro_end = ?`;
  return new Promise((resolve, reject) => {
    conn.query(query, [Logradouro_end], (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results[0]?.Id_end || null);
      }
    });
  });
}

export function getClientes() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT Nome, Email, Telefone, Senha_cli, Logradouro_end, Numero_end, Bairro_end, Cep_end, Complemento_end
      FROM Cliente
      INNER JOIN Endereco ON Cliente.Id_end = Endereco.Id_end
    `;
    conn.query(sql, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function createEndereco(data) {
  const conn = connection();
  const query = `INSERT INTO Endereco (Logradouro_end, Numero_end, Bairro_end, Cep_end, Complemento_end) VALUES (?, ?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    conn.query(query, data, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function createUser(data) {
  const conn = connection();
  const query = `INSERT INTO Cliente (Nome, Email, Senha_cli, Telefone, Id_end) VALUES (?, ?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    conn.query(query, data, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getCategorias() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Categoria;`;
    conn.query(sql, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getProdutos() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.Id_prod, p.Nome_prod, p.Preco_prod, p.Peso_prod, p.Ml_prod,
                p.Tipo_prod, p.Quantidade_prod, p.Codigo_prod, p.Foto,
                c.Nome_categ
                FROM Produto p
                JOIN Categoria c ON p.Id_categ = c.Id_categ`;
    conn.query(sql, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getProduto(Id_prod) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.Id_prod, p.Nome_prod, p.Preco_prod, p.Peso_prod, p.Ml_prod,
                p.Tipo_prod, p.Quantidade_prod, p.Codigo_prod, p.Foto,
                c.Nome_categ
                FROM Produto p
                JOIN Categoria c ON p.Id_categ = c.Id_categ
                WHERE p.Id_prod = ?`;
    conn.query(sql, [Id_prod], (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function createProduto(produto) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Produto (Nome_prod, Preco_prod, Peso_prod, Ml_prod, Tipo_prod, Quantidade_prod, Codigo_prod, Foto, Id_categ)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    conn.query(sql, produto, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function editProduto(produto) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Produto 
                SET  Nome_prod = ?, Preco_prod = ?, Peso_prod = ?, Ml_prod = ?, Tipo_prod = ?, Quantidade_prod = ?, Codigo_prod = ?, Foto = ?, Id_categ = ?
                WHERE Id_prod = ?`;
    conn.query(sql, produto, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function deleteProduto(Id_prod) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    // Primeiro, deletar os registros na tabela filha
    const sql1 = `DELETE FROM Pedido_produto WHERE Id_prod = ?;`;
    const sql2 = `DELETE FROM Produto WHERE Id_prod = ?;`;

    conn.query(sql1, [Id_prod], (error) => {
      if (error) {
        conn.end();
        return reject(error);
      }

      // Depois, deletar o produto
      conn.query(sql2, [Id_prod], (error, results) => {
        conn.end();
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
}
