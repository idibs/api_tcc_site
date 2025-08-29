import connection from "./connection.js";

export async function getUsers() {
  const conn = connection();
  return new Promise((resolve, reject) => {
    conn.query(`SELECT Id_cli, Nome_cli, Email_cli, Senha_cli, Logradouro_end, Numero_end, 
      Bairro_end, Cep_end, Complemento_end FROM Cliente
        INNER JOIN Endereco ON Cliente.Id_end = Endereco.Id_end `, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
    conn.end();
  });
}

export async function insertUser(data) {
  const conn = connection();
    const query = `INSERT INTO Cliente (Nome_cli, Email_cli, Senha_cli, Id_end) VALUES (?, ?, ?, ?)`;
    conn.query(query, data)
    conn.end();
}

export async function insertAdress(data) {
  const conn = connection();
    const query = `INSERT INTO Endereco 
    (Logradouro_end, Numero_end, Bairro_end, Cep_end, Complemento_end) 
    VALUES (?, ?, ?, ?, ?)`;
    conn.query(query, data);
    conn.end();
}

export async function getAdressId(Logradouro_end) {
  const conn = connection();
  return new Promise((resolve, reject) => {
    conn.query(`SELECT Id_end FROM endereco`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
    conn.end();
  });
}