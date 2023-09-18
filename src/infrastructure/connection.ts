import mysql from "mysql2/promise";

export async function connectDB() {
  return await mysql.createConnection({
    host: "localhost",
    database: "reversi",
    user: "test",
    password: "password",
  });
}
