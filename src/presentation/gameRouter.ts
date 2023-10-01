import express from "express";
import { StartNewGameUseCase } from "../application/usecase/startNewGameUseCase";
import { GameMySQLRepository } from "../infrastructure/repository/game/gameMySQLRepository";
import { TurnMySQLRepository } from "../infrastructure/repository/turn/turnMySQLRepository";

export const gameRouter = express.Router();

// FIXME: これはDIコンテナでやるべき
const startNewGameUseCase = new StartNewGameUseCase(
  new GameMySQLRepository(),
  new TurnMySQLRepository()
);

gameRouter.post("/api/games", async (req, res) => {
  await startNewGameUseCase.execute();

  res.status(201).end();
});
