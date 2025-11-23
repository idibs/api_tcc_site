import mysql from "mysql2";

export default function connection() {
  return mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: "tcc",
    port: process.env.DB_PORT ?? 3306,
  });
}
