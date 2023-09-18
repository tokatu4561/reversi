import { DARK, LIGHT } from "../application/constants";
import { connectDB } from "../data/connection";
import { GameGateway } from "../data/gameGateway";
import { toDisc } from "../domain/disc";
import { Point } from "../domain/point";
import { TurnRepository } from "../domain/turnRepository";

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

export class TurnService {
  constructor() {}

  async findLatestGameTurnByTurnCount(
    turnCount: number
  ): Promise<FindLatestGameTurnByTurnCountOutput> {
    const conn = await connectDB();
    try {
      const gameRecord = await gameGateway.findLatest(conn);
      if (!gameRecord) {
        throw new Error("Latest game not found");
      }

      const turn = await turnRepository.findForGameIdAndTurnCount(
        conn,
        gameRecord.id,
        turnCount
      );

      return new FindLatestGameTurnByTurnCountOutput(
        turnCount,
        turn.board.discs,
        turn.nextDisc,
        // TODO 決着がついている場合、game_results テーブルから取得する
        null
      );
    } finally {
      await conn.end();
    }
  }

  async registerTurn(turnCount: number, disc, x, y: number) {
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
