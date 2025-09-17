import connection from "./connection.js";

/*export function getUsers() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT Id_cli, Nome_cli, Email_cli, Senha_cli, Logradouro_end, Numero_end, Bairro_end, Cep_end, Complemento_end
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

export function insertUser(data) {
  const conn = connection();
  const query = `INSERT INTO Cliente (Nome_cli, Email_cli, Senha_cli, Id_end) VALUES (?, ?, ?, ?)`;
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

export function insertAddress(data) {
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

export function getAddressId(Logradouro_end) {
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

export function getProdutos() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM Produto`;
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
    const sql = `
      SELECT * FROM Produto WHERE Id_prod = ?`;
    conn.query(sql, [Id_prod],  (error, results) => {
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
