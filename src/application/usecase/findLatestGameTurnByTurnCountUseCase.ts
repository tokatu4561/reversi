import { GameRepositoryInterface } from "../../domain/game/gameRepository";
import { GameResult } from "../../domain/gameResult/gameResult";
import { GameResultRepositoryInterface } from "../../domain/gameResult/gameResultRepository";
import { WinnerDisc } from "../../domain/gameResult/winnerDisc";
import { TurnRepositoryInterface } from "../../domain/turn/turnRepository";
import { connectDB } from "../../infrastructure/connection";
import { NotFoundLatestGame } from "../error/NotFoundLatestGame";

class FindLatestGameTurnByTurnCountOutput {
  constructor(
    private _turnCount: number,
    private _board: number[][],
    private _nextDisc: number | undefined,
    private _winnerDisc: WinnerDisc | undefined
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

export class FindLatestGameTurnByTurnCountUseCase {
  constructor(
    private _turnRepository: TurnRepositoryInterface,
    private _gameRepository: GameRepositoryInterface,
    private _gameResultRepository: GameResultRepositoryInterface
  ) {}

  async execute(
    gameId: number,
    turnCount: number
  ): Promise<FindLatestGameTurnByTurnCountOutput> {
    const conn = await connectDB();
    try {
      const game = await this._gameRepository.find(conn, gameId);
      if (!game) {
        throw new NotFoundLatestGame("game not found");
      }
      if (!game.id) {
        throw new Error("game.id not exist");
      }

      const turn = await this._turnRepository.findForGameIdAndTurnCount(
        conn,
        game.id,
        turnCount
      );

      let gameResult: GameResult | undefined = undefined;
      if (turn.gameEnd()) {
        gameResult = await this._gameResultRepository.findForGameId(
          conn,
          game.id
        );
      }

      return new FindLatestGameTurnByTurnCountOutput(
        turnCount,
        turn.board.discs,
        turn.nextDisc,
        gameResult?.winenrDisc
      );
    } finally {
      await conn.end();
    }
  }
}
