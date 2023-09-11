import express from "express";
import morgan from "morgan";
import mysql from "mysql2/promise";
import "express-async-errors";
import { GameGateway } from "./data/gameGateway";

const PORT = 3000;

const app = express();

const INITIAL_BOARD = [
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, DARK, LIGHT, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, LIGHT, DARK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
];

const gameGateway = new GameGateway();

app.use(morgan("dev"));
app.use(express.static("public", { extensions: ["html"] }));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/api/error", (req, res) => {
  throw new Error("Error!");
});

// post /api/games -> create a new game
app.post("/api/games", async (req, res) => {
  const now = new Date();

  const conn = await connectDB();
  try {
    await conn.beginTransaction();

    const gameRecord = await gameGateway.insert(conn, now);

    const turnInsertResult = await conn.execute<mysql.ResultSetHeader>(
      "INSERT INTO turns (game_id, turn_count, next_disc, end_at) VALUES (?, ?, ?, ?)",
      [gameRecord.id, 0, DARK, now]
    );

    const turnId = turnInsertResult[0].insertId;

    // ボードのサイズ
    const squareCount = 8 * 8;

    // ターンの(盤面)状態を保存
    const squaresInsertSql =
      "INSERT INTO squares (turn_id, x, y, disc) VALUES " +
      Array.from(Array(squareCount))
        .map(() => "(?, ?, ?, ?)")
        .join(", ");
    const squaresInsertValues: any[] = [];
    INITIAL_BOARD.forEach((row, y) => {
      row.forEach((disc, x) => {
        squaresInsertValues.push(turnId, x, y, disc);
      });
    });

    await conn.execute(squaresInsertSql, squaresInsertValues);

    await conn.commit();
  } finally {
    await conn.end();
  }

  res.json({ message: "Game created" });
});

app.get("/api/games/latest/turns/:turnCount", async (req, res) => {
  const { turnCount } = req.params;

  const conn = await connectDB();
  try {
    // 最新の対戦を取得
    const gameRecord = await gameGateway.findLatest(conn);

    const turnSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      "SELECT * FROM turns WHERE game_id = ? turn_count = ?",
      [gameRecord.id, turnCount]
    );

    const turn = turnSelectResult[0][0];

    const squareSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      "SELECT id, turn_id, x, y, disc FROM squares WHERE turn_id = ?",
      [turn.id]
    );

    const squares = squareSelectResult[0];

    const board: any[][] = Array.from(Array(8)).map(() =>
      Array.from(Array(8)).map(() => EMPTY)
    );

    squares.forEach((square) => {
      board[square.y][square.x] = square.disc;
    });

    const responseBody = {
      turnCount: turn.turn_count,
      board,
      nextDisc: turn.next_disc,
      // TODO: winnerDisc 勝敗が決まっていない場合は null
      winnerDisc: null,
    };

    res.json(responseBody);
  } finally {
    await conn.end();
  }
});

// ターン(盤面)を保存する　ターンを進める
app.post("/api/games/latest/turns", async (req, res) => {
  const {
    turnCount,
    move: { disc, x, y },
  } = req.body;

  const conn = await connectDB();

  const prevTurnCount = turnCount - 1;
  // １つ前のターンを取得する
  //   const prevTurnSelectResult = await conn.execute<mysql.RowDataPacket[]>(
  //     "SELECT * FROM turns WHERE game_id = ? turn_count = ?",
  //     [game.id, prevTurnCount]
  //   );

  // 盤面に置けるかチェックする

  // 石を置く

  // ターンを保存する 進める

  try {
    await conn.beginTransaction();
  } finally {
    await conn.end();
  }

  res.status(201).json({ message: "Turn created" });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

async function connectDB() {
  return await mysql.createConnection({
    host: "localhost",
    database: "reversi",
    user: "test",
    password: "password",
  });
}
