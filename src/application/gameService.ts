import { DARK, INITIAL_BOARD } from "../application/constants";
import { connectDB } from "../data/connection";
import { GameGateway } from "../data/gameGateway";
import { SquareGateway } from "../data/squareGateway";
import { TurnGateway } from "../data/turnGateway";

const gameGateway = new GameGateway();
const turnGateway = new TurnGateway();
const squareGateway = new SquareGateway();

export class GameService {
  constructor() {
    console.log("GameService constructor");
  }

  public async startNewGame() {
    const now = new Date();

    const conn = await connectDB();
    try {
      await conn.beginTransaction();

      const gameRecord = await gameGateway.insert(conn, now);
      const turnRecord = await turnGateway.insert(
        conn,
        gameRecord.id,
        0,
        DARK,
        now
      );
      await squareGateway.insertAll(conn, turnRecord.id, INITIAL_BOARD);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
