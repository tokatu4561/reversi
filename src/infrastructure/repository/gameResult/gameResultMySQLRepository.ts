import mysql from "mysql2/promise";
import { GameResult } from "../../../domain/gameResult/gameResult";
import { toWinnerDisc } from "../../../domain/gameResult/winnerDisc";
import { GameResultGateway } from "./gameResultGateway";
import { GameResultRepositoryInterface } from "../../../domain/gameResult/gameResultRepository";

const gameResultGateway = new GameResultGateway();

export class GameResultMySQLRepository
  implements GameResultRepositoryInterface
{
  async findForGameId(
    conn: mysql.Connection,
    gameId: number
  ): Promise<GameResult | undefined> {
    const gameResultRecord = await gameResultGateway.findForGameId(
      conn,
      gameId
    );

    if (!gameResultRecord) {
      return undefined;
    }

    return new GameResult(
      gameResultRecord.gameId,
      toWinnerDisc(gameResultRecord.winnerDisc),
      gameResultRecord.endAt
    );
  }

  async save(conn: mysql.Connection, gameResult: GameResult) {
    await gameResultGateway.insert(
      conn,
      gameResult.gameId,
      gameResult.winenrDisc,
      gameResult.endAt
    );
  }
}
