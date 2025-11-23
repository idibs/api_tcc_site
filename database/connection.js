import mysql from "mysql2";

export default function connection() {
  return mysql.createConnection({
    host: env(MYSQLHOST),
    user: env(MYSQLUSER),
    password: env(MYSQLPASSWORD),
    database: "tcc",
    port: 3306,
  });
}
