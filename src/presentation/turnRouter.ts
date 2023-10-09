import express from "express";
import { FindLatestGameTurnByTurnCountUseCase } from "../application/usecase/findLatestGameTurnByTurnCountUseCase";
import { TurnMySQLRepository } from "../infrastructure/repository/turn/turnMySQLRepository";
import { GameMySQLRepository } from "../infrastructure/repository/game/gameMySQLRepository";
import { GameResultMySQLRepository } from "../infrastructure/repository/gameResult/gameResultMySQLRepository";
import { RegisterTurnUseCase } from "../application/usecase/registerTurnUsecase";

export const turnRouter = express.Router();

interface TurnGatResponseBody {
  turnCount: number;
  board: number[][];
  nextDisc: number | null;
  winnerDisc: number | null;
}

// FIXME: これはDIコンテナでやるべき
const findLatestGameTurnByTurnCountUseCase =
  new FindLatestGameTurnByTurnCountUseCase(
    new TurnMySQLRepository(),
    new GameMySQLRepository(),
    new GameResultMySQLRepository()
  );

const registerTurnUseCase = new RegisterTurnUseCase(
  new TurnMySQLRepository(),
  new GameMySQLRepository(),
  new GameResultMySQLRepository()
);

turnRouter.get(
  "/api/games/:gameId/turns/:turnCount",
  async (req, res: express.Response<TurnGatResponseBody>) => {
    const gameId = parseInt(req.params.gameId);
    const turnCount = parseInt(req.params.turnCount);

    const output = await findLatestGameTurnByTurnCountUseCase.execute(
      gameId,
      turnCount
    );

    const responseBody: TurnGatResponseBody = {
      turnCount: output.turnCount,
      board: output.board,
      nextDisc: output.nextDisc ?? null,
      winnerDisc: output.winnerDisc ?? null,
    };

    res.json(responseBody);
  }
);

interface TurnPostRequestBody {
  turnCount: number;
  move: {
    disc: number;
    x: number;
    y: number;
  };
}

turnRouter.post(
  "/api/games/latest/turns",
  async (req: express.Request<{}, {}, TurnPostRequestBody>, res) => {
    const turnCount = req.body.turnCount;
    const disc = req.body.move.disc;
    const x = req.body.move.x;
    const y = req.body.move.y;

    await registerTurnUseCase.execute(turnCount, disc, x, y);

    res.status(201).end();
  }
);
