import mysql from "mysql2/promise";
import { GameRecord } from "./gameRecord";

export class GameGateway {
  async findLatest(conn: mysql.Connection) {
    // 最新の対戦を取得
    const gameSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      "SELECT id, started_at FROM games ORDER BY id DESC LIMIT 1"
    );
    const game = gameSelectResult[0][0];

    if (!game) {
      throw new Error("対戦が見つかりませんでした");
    }

    return new GameRecord(game.id, game.started_at);
  }

  async insert(conn: mysql.Connection, startedAt: Date): Promise<GameRecord> {
    const gameInsertResult = await conn.execute<mysql.ResultSetHeader>(
      "INSERT INTO games (started_at) VALUES (?)",
      [startedAt]
    );

    const gameId = gameInsertResult[0].insertId;

    return new GameRecord(gameId, startedAt);
  }
}
