import express from "express";
import { TurnService } from "../application/turnService";

export const turnRouter = express.Router();

const turnService = new TurnService();

interface TurnGatResponseBody {
  turnCount: number;
  board: number[][];
  nextDisc: number | null;
  winnerDisc: number | null;
}

turnRouter.get(
  "/api/games/latest/turns/:turnCount",
  async (req, res: express.Response<TurnGatResponseBody>) => {
    const turnCount = parseInt(req.params.turnCount);

    const output = await turnService.findLatestGameTurnByTurnCount(turnCount);

    const responseBody: TurnGatResponseBody = {
      turnCount: output.turnCount,
      board: output.board,
      nextDisc: output.nextDisc,
      winnerDisc: output.winnerDisc,
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

    await turnService.registerTurn(turnCount, disc, x, y);

    res.status(201).end();
  }
);
