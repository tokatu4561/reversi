import { GameRepositoryInterface } from "../../domain/game/gameRepository";
import { Game } from "../../domain/game/game";
import { firstTurn } from "../../domain/turn/turn";
import { TurnRepositoryInterface } from "../../domain/turn/turnRepository";
import { connectDB } from "../../infrastructure/connection";
import { NotFoundLatestGame } from "../error/NotFoundLatestGame";

export class StartNewGameUseCase {
  constructor(
    private _gameRepository: GameRepositoryInterface,
    private _turnRepository: TurnRepositoryInterface
  ) {}

  async execute() {
    const now = new Date();

    const conn = await connectDB();
    try {
      await conn.beginTransaction();

      const game = await this._gameRepository.save(
        conn,
        new Game(undefined, now)
      );
      if (!game) {
        throw new NotFoundLatestGame("Game is not found");
      }
      if (!game.id) {
        throw new Error("Game id is undefined");
      }

      const turn = firstTurn(game.id, now);

      await this._turnRepository.save(conn, turn);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
