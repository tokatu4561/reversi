import express from "express";
import morgan from "morgan";
import "express-async-errors";
import { gameRouter } from "./presentation/gameRouter";
import { turnRouter } from "./presentation/turnRouter";
import { DomainError } from "./domain/error/DomainError";
import { AppError } from "./application/error/AppError";
import { NotFoundLatestGame } from "./application/error/NotFoundLatestGame";
import { roomRouter } from "./presentation/roomRouter";

const PORT = 3000;

const app = express();

app.use(morgan("dev"));
app.use(express.static("public", { extensions: ["html"] }));
app.use(express.json());

app.use(gameRouter);
app.use(roomRouter);
app.use(turnRouter);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof DomainError) {
      res.status(400).json({
        type: err.type,
        message: err.message,
      });
      return;
    }

    if (err instanceof AppError) {
      if (err instanceof NotFoundLatestGame) {
        res.status(404).json({
          type: err.type,
          message: err.message,
        });
        return;
      }
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
