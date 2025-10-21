import connection from "./connection.js";

export function deleteOutrosProdutos(id) {
  const conn = connection();
  const query = `DELETE FROM outros_produtos WHERE Id_out = ?`;
  return new Promise((resolve, reject) => {
    conn.query(query, id, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function deleteProdutosEnsacados(id) {
  const conn = connection();
  const query = `DELETE FROM produto_ensacado WHERE Id_ens = ?`;
  return new Promise((resolve, reject) => {
    conn.query(query, id, (error, results) => {
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
  /*Cidade_end*/
  const conn = connection();
  const query = `INSERT INTO Endereco (Rua_end, Numero_end, Bairro_end, Cep_end, Cidade_end, Complemento_end) VALUES (?, ?, ?, ?, ?, ?)`;
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

export function getEndereco(cep, numero) {
  const conn = connection();
  const query = `select Id_end from endereco WHERE Cep_end = ? and Numero_end = ?`;
  return new Promise((resolve, reject) => {
    conn.query(query, [cep, numero], (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function createCliente(data) {
  const conn = connection();
  const query = `INSERT INTO pessoa (Nome_pes, 
                Telefone_pes, 
                Email_pes, 
                Senha_pes, 
                Tipo_pes, 
                Id_end) VALUES
                (?, ?, ?, ?, 'Cliente', ?);`;
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

export function getEnsacados() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                  Id_ens as Id, 
                  Nome_ens as Nome,  
                  Peso_ens as Peso, 
                  Preco_ens as Preco,
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

export function getProdutos() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                  Id_prod AS Id, 
                  Nome_prod as Nome, 
                  Preco_med_prod as Preco, 
                  Quantidade_prod as Quantidade, 
                  Codigo_prod as Codigo, 
                  Foto_prod as Foto
                FROM produto;`;
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

export function getEnsacadoById(id) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                  Id_ens as Id, 
                  Nome_ens as Nome,  
                  Peso_ens as Peso, 
                  Preco_ens as Preco,
                  Quantidade_ens as Quantidade, 
                  Codigo_ens as Codigo, 
                  Foto_ens as Foto
                FROM produto_ensacado
                WHERE Id_ens = ?;`;
    conn.query(sql, [id], (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getProdutoById(id) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                  Id_prod as Id, 
                  Nome_prod as Nome,  
                  Preco_medio_prod as Preco,
                  Quantidade_prod as Quantidade, 
                  Codigo_prod as Codigo, 
                  Foto_prod as Foto,
                  Descricao_prod as Descricao
                FROM produto
                WHERE Id_prod = ?;`;
    conn.query(sql, [id], (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getOutroProdutoById(id) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
                  Id_out as Id, 
                  Nome_out as Nome, 
                  Quantidade_out as Quantidade, 
                  Preco_med_out as Preco,
                  Peso_out as Peso, 
                  Codigo_out as Codigo, 
                  Foto_out as Foto,
                  Nome_categ as Categoria
                FROM outros_produtos p
                INNER JOIN categoria c ON p.Id_categ = c.Id_categ
                WHERE Id_out = ?;`;
    conn.query(sql, [id], (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getCereaisByIdNome(id, nomeProduto) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM produto_ensacado WHERE Id_ens = ? AND Nome_ens = ?;`;
    conn.query(sql, [id, nomeProduto], (error, results) => {
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
                  Preco_med_out as Preco,
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

export function createPedido(pedido) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO pedido_produto
                (Id_pes, Id_ens, Id_out, Id_end, Data_pedprod, Quantidade_pedprod, Peso_total_pedprod, Valor_total_pedprod, Status_pedprod, Metodo_pagamento_pedprod) VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    conn.query(sql, pedido, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getClienteIdByNome(nome) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT Id_pes FROM pessoa WHERE Tipo_pes = 'Cliente' and Nome_pes = ?;`;
    conn.query(sql, nome, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getCerealIdByNome(nome) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT Id_ens, Peso_ens as Peso FROM produto_ensacado WHERE Nome_ens = ?;`;
    conn.query(sql, nome, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getOutrosProdutosIdByNome(nome) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT Id_out, Peso_out as Peso FROM outros_produtos WHERE Nome_out = ?;`;
    conn.query(sql, nome, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getClienteEmail(login) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM pessoa WHERE Email_pes = ?;`;
    conn.query(sql, login, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export function getClienteSenha(login) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM pessoa WHERE Senha_pes = ?;`;
    conn.query(sql, login, (error, results) => {
      conn.end();
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
