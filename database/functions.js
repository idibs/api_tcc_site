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

export function getCereais() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                  Id_ens as Id, 
                  Nome_ens as Nome,  
                  Peso_ens as Peso, 
                  Quantidade_ens as Quantidade, 
                  Codigo_ens as Codigo, 
                  Foto_ens as Foto
                FROM produto_ensacado;`;
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

export function getOutrosProdutos() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                  Id_out as Id, 
                  Nome_out as Nome, 
                  Quantidade_out as Quantidade, 
                  Peso_out as Peso, 
                  Codigo_out as Codigo, 
                  Foto_out as Foto,
                  Nome_categ as Categoria
                FROM outros_produtos p
                INNER JOIN categoria c ON p.Id_categ = c.Id_categ;`;
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
