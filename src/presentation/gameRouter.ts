import express from "express";
import { StartNewGameUseCase } from "../application/usecase/startNewGameUseCase";
import { GameMySQLRepository } from "../infrastructure/repository/game/gameMySQLRepository";
import { TurnMySQLRepository } from "../infrastructure/repository/turn/turnMySQLRepository";
import { FindLastGamesUseCase } from "../application/usecase/findLastGamesUseCase";
import { FindLastGameQueryService } from "../infrastructure/query/findLastGameQueryService";

export const gameRouter = express.Router();

// FIXME: これはDIコンテナでやるべき
const startNewGameUseCase = new StartNewGameUseCase(
  new GameMySQLRepository(),
  new TurnMySQLRepository()
);

const findLastGamesUseCase = new FindLastGamesUseCase(
  new FindLastGameQueryService()
);

interface GetGamesResponseBody {
  games: {
    id: number;
    darkCount: number;
    lightCount: number;
    winnerDisc: number | null;
    endAt: Date;
    startedAt: Date;
  }[];
}

gameRouter.get("/api/games", async (req, res) => {
  const games = await findLastGamesUseCase.execute();

  const responseBody: GetGamesResponseBody = {
    games: games.map((game) => ({
      id: game.gameId,
      darkCount: game.darkCount,
      lightCount: game.lightCount,
      winnerDisc: game.winnerDisc,
      endAt: game.endAt,
      startedAt: game.startedAt,
    })),
  };

  res.json(responseBody);
});

gameRouter.post("/api/games", async (req, res) => {
  await startNewGameUseCase.execute();

  res.status(201).end();
});
