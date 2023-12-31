import mysql from "mysql2/promise";
import { Game } from "./game";

export interface GameRepositoryInterface {
  findLatest(conn: mysql.Connection): Promise<Game | undefined>;
  find(conn: mysql.Connection, id: number): Promise<Game | undefined>;
  save(conn: mysql.Connection, game: Game): Promise<Game>;
}
