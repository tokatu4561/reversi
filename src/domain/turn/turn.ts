import { Board, initialBoard } from "./board";
import { Disc } from "./disc";
import { Move } from "./move";
import { Point } from "./point";

export class Turn {
  constructor(
    private _gameId: number,
    private _turnCount: number,
    private _nextDisc: Disc,
    private _move: Move | undefined,
    private _board: Board,
    private _endAt: Date | undefined
  ) {}

  get gameId() {
    return this._gameId;
  }

  get turnCount() {
    return this._turnCount;
  }

  get nextDisc() {
    return this._nextDisc;
  }

  get move() {
    return this._move;
  }

  get board() {
    return this._board;
  }

  get endAt() {
    return this._endAt;
  }

  // place is used to place a disc on the board
  public placeNext(disc: Disc, point: Point): Turn {
    // 打つ石が、次の石ではない場合、置くことはできない 交互に打つ
    if (disc !== this._nextDisc) {
      throw new Error("It is not your turn");
    }

    const move = new Move(disc, point);

    const nextBoard = this._board.place(move);

    // 次のターンの石の色を決める
    // TODO: 次のターンが置けない場合はスキップ
    const nextDisc = disc === Disc.Dark ? Disc.Light : Disc.Dark;

    return new Turn(
      this._gameId,
      this._turnCount + 1,
      nextDisc,
      move,
      nextBoard,
      new Date()
    );
  }
}

export const firstTurn = (gameId: number, endAt: Date) => {
  return new Turn(gameId, 0, Disc.Dark, undefined, initialBoard, endAt);
};