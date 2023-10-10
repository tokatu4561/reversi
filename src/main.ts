import express from "express";
import morgan from "morgan";
import "express-async-errors";
import http from "http";
import { Server } from "socket.io";
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

const server: http.Server = http.createServer(app);
const io = new Server(server);

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

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// 接続したユーザーに対するイベント
io.on("connection", (socket) => {
  console.log("connected!!!");
  // chat messageイベントを受信
  socket.on("turnRegistered", ({ gameId, turnCount }) => {
    // ユーザーにchat messageイベントでメッセージを送信
    io.emit("turnRegistered", { gameId, turnCount });
  });

  socket.on("startGame", function (gameId) {
    io.emit("startGame", gameId);
  });

  socket.on("disconnect", () => {});
});
