import mysql from "mysql2";

export default function connection() {
  return mysql.createConnection({
    uri: "mysql://root:gPuDQcSHNzIAYSOyfMNBkeDOXcggxbwG@mysql.railway.internal:3306/railway"
  });
}
