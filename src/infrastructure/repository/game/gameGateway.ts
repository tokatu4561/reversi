import mysql from "mysql2/promise";
import { GameRecord } from "./gameRecord";

export class GameGateway {
  async findLatest(conn: mysql.Connection) {
    // 最新の対戦を取得
    const gameSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      "SELECT id, room_id, started_at FROM games ORDER BY id DESC LIMIT 1"
    );
    const game = gameSelectResult[0][0];

    if (!game) {
      throw new Error("対戦が見つかりませんでした");
    }

    return new GameRecord(game.id, game.roomId, game.started_at);
  }

  async find(conn: mysql.Connection, id: number) {
    // 対戦を取得
    const gameSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      "SELECT id, room_id, started_at FROM games WHERE id = ?",
      [id]
    );
    const game = gameSelectResult[0][0];

    if (!game) {
      throw new Error("対戦が見つかりませんでした");
    }

    return new GameRecord(game.id, game.roomId, game.started_at);
  }

  async insert(
    conn: mysql.Connection,
    roomId: number,
    startedAt: Date
  ): Promise<GameRecord> {
    const gameInsertResult = await conn.execute<mysql.ResultSetHeader>(
      "INSERT INTO games (room_id, started_at) VALUES (?, ?)",
      [roomId, startedAt]
    );

    const gameId = gameInsertResult[0].insertId;

    return new GameRecord(gameId, roomId, startedAt);
  }
}
