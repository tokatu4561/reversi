import mysql from "mysql2/promise";
import { GameGateway } from "../data/gameGateway";
import { Game } from "./game";

const gameGateway = new GameGateway();

export class GameRepository {
  async findLatest(conn: mysql.Connection): Promise<Game> {
    const gameRecord = await gameGateway.findLatest(conn);
    if (!gameRecord) {
      throw new Error("Latest game not found");
    }

    return new Game(gameRecord.id, gameRecord.startedAt);
  }

  async save(conn: mysql.Connection, game: Game): Promise<Game> {
    const gameRecord = await gameGateway.insert(conn, game.startedAt);

    return new Game(gameRecord.id, gameRecord.startedAt);
  }
}
