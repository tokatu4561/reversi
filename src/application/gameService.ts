import { connectDB } from "../infrastructure/connection";
import { Game } from "../domain/game/game";
import { GameRepository } from "../domain/game/gameRepository";
import { firstTurn } from "../domain/turn/turn";
import { TurnRepository } from "../domain/turn/turnRepository";
import { NotFoundLatestGame } from "./error/NotFoundLatestGame";

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
      if (!game) {
        throw new NotFoundLatestGame("Game is not found");
      }
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
