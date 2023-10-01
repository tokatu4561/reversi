import mysql from "mysql2/promise";
import { GameResultRecord } from "./gameResultRecord";

export class GameResultGateway {
  async findForGameId(
    conn: mysql.Connection,
    gameId: number
  ): Promise<GameResultRecord | undefined> {
    const gameSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      "select id, game_id, winner_id, end_at from game_results where game_id = ?",
      [gameId]
    );
    const record = gameSelectResult[0][0];

    if (!record) {
      return undefined;
    }

    // TODO: winner_id が id じゃなく disc の値になってる 後々 勝者ユーザーのidにする
    return new GameResultRecord(
      record["id"],
      record["game_id"],
      record["winner_id"],
      record["end_at"]
    );
  }

  async insert(
    conn: mysql.Connection,
    gameId: number,
    winnerDisc: number,
    endAt: Date
  ) {
    await conn.execute(
      "insert into game_results (game_id, winner_id, end_at) values (?, ?, ?)",
      [gameId, winnerDisc, endAt]
    );
  }
}
