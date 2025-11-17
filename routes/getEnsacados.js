// arquivo getEnsacados.js
export async function getEnsacadosPeso(prodId) {
  const query = 'SELECT Peso_ens, Codigo_ens FROM produto_ensacado WHERE Id_prod = ?';
  const values = [prodId];

  try {
    const rows = await db.query(query, values);
    console.debug("Resultado da consulta ao banco:", rows);
    return rows;
  } catch (error) {
    console.error("Erro na consulta ao banco:", error);
    throw error;
  }
}
