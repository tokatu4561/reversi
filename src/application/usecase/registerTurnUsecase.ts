import { GameRepositoryInterface } from "../../domain/game/gameRepository";
import { GameResult } from "../../domain/gameResult/gameResult";
import { GameResultRepositoryInterface } from "../../domain/gameResult/gameResultRepository";
import { toDisc } from "../../domain/turn/disc";
import { Point } from "../../domain/turn/point";
import { TurnRepositoryInterface } from "../../domain/turn/turnRepository";
import { connectDB } from "../../infrastructure/connection";

export class RegisterTurnUseCase {
  private _gameRepository: GameRepositoryInterface;
  private _turnRepository: TurnRepositoryInterface;
  private _gameResultRepository: GameResultRepositoryInterface;

  constructor(
    turnRepository: TurnRepositoryInterface,
    gameRepository: GameRepositoryInterface,
    gameResultRepository: GameResultRepositoryInterface
  ) {
    this._turnRepository = turnRepository;
    this._gameRepository = gameRepository;
    this._gameResultRepository = gameResultRepository;
  }

  public async execute(turnCount: number, disc: number, x: number, y: number) {
    const conn = await connectDB();
    try {
      await conn.beginTransaction();

      // 1つ前のターンを取得する
      const game = await this._gameRepository.findLatest(conn);
      if (!game) {
        throw new Error("Latest game not found");
      }
      if (!game.id) {
        throw new Error("game.id not exist");
      }

      const previousTurnCount = turnCount - 1;
      const prevTurn = await this._turnRepository.findForGameIdAndTurnCount(
        conn,
        game.id,
        previousTurnCount
      );

      const newTurn = prevTurn.placeNext(toDisc(disc), new Point(x, y));

      // ターンを保存する
      await this._turnRepository.save(conn, newTurn);

      // 勝敗が決した場合、対戦結果を保存
      if (newTurn.gameEnd()) {
        const winnerDisc = newTurn.winnerDisc();
        const gameResult = new GameResult(game.id, winnerDisc, newTurn.endAt);
        await this._gameResultRepository.save(conn, gameResult);
      }

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
