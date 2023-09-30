import { connectDB } from "../infrastructure/connection";
import { GameGateway } from "../infrastructure/gameGateway";
import { toDisc } from "../domain/turn/disc";
import { GameRepository } from "../domain/game/gameRepository";
import { Point } from "../domain/turn/point";
import { TurnRepository } from "../domain/turn/turnRepository";
import { GameResult } from "../domain/gameResult/gameResult";
import { GameResultRepository } from "../domain/gameResult/gameResultRepository";

const gameGateway = new GameGateway();

class FindLatestGameTurnByTurnCountOutput {
  constructor(
    private _turnCount: number,
    private _board: number[][],
    private _nextDisc: number | null,
    private _winnerDisc: number | null
  ) {}

  get turnCount() {
    return this._turnCount;
  }

  get board() {
    return this._board;
  }

  get nextDisc() {
    return this._nextDisc;
  }

  get winnerDisc() {
    return this._winnerDisc;
  }
}

const turnRepository = new TurnRepository();
const gameRepository = new GameRepository();
const gameResultRepository = new GameResultRepository();

export class TurnService {
  constructor() {}

  async findLatestGameTurnByTurnCount(
    turnCount: number
  ): Promise<FindLatestGameTurnByTurnCountOutput> {
    const conn = await connectDB();
    try {
      const game = await gameRepository.findLatest(conn);
      if (!game.id) {
        throw new Error("Game id is undefined");
      }

      const turn = await turnRepository.findForGameIdAndTurnCount(
        conn,
        game.id,
        turnCount
      );

      let gameResult: GameResult | undefined = undefined;
      if (turn.gameEnd()) {
        gameResult = await gameResultRepository.findForGameId(conn, game.id);
      }

      return new FindLatestGameTurnByTurnCountOutput(
        turnCount,
        turn.board.discs,
        turn.nextDisc ?? null,
        // TODO 決着がついている場合、game_results テーブルから取得する
        null
      );
    } finally {
      await conn.end();
    }
  }

  async registerTurn(turnCount: number, disc: number, x: number, y: number) {
    const conn = await connectDB();
    try {
      await conn.beginTransaction();

      // 1つ前のターンを取得する
      const gameRecord = await gameGateway.findLatest(conn);
      if (!gameRecord) {
        throw new Error("Latest game not found");
      }

      const previousTurnCount = turnCount - 1;
      const prevTurn = await turnRepository.findForGameIdAndTurnCount(
        conn,
        gameRecord.id,
        previousTurnCount
      );

      const newTurn = prevTurn.placeNext(toDisc(disc), new Point(x, y));

      // ターンを保存する
      await turnRepository.save(conn, newTurn);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
