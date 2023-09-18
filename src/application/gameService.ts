import { connectDB } from "../infrastructure/connection";
import { Game } from "../domain/game";
import { GameRepository } from "../domain/gameRepository";
import { firstTurn } from "../domain/turn";
import { TurnRepository } from "../domain/turnRepository";

const turnRepository = new TurnRepository();
const gameRepository = new GameRepository();

export class GameService {
  constructor() {}

  public async startNewGame() {
    const now = new Date();

    const conn = await connectDB();
    try {
      await conn.beginTransaction();

      const game = await gameRepository.save(conn, new Game(undefined, now));
      if (!game.id) {
        throw new Error("Game id is undefined");
      }

      const turn = firstTurn(game.id, now);

      await turnRepository.save(conn, turn);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
