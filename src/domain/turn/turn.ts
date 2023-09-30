import { Board, initialBoard } from "./board";
import { Disc } from "./disc";
import { CanNotPlaceDisc } from "./error/CanNotPlaceDisc";
import { Move } from "./move";
import { Point } from "./point";

export class Turn {
  constructor(
    private _gameId: number,
    private _turnCount: number,
    private _nextDisc: Disc | undefined,
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
      throw new CanNotPlaceDisc("It is not your turn");
    }

    const move = new Move(disc, point);

    const nextBoard = this._board.place(move);

    const nextDisc = this.decideNextDisc(nextBoard, disc);

    return new Turn(
      this._gameId,
      this._turnCount + 1,
      nextDisc,
      move,
      nextBoard,
      new Date()
    );
  }

  private decideNextDisc(board: Board, previousDisc: Disc): Disc | undefined {
    // 次のターンの石の色を決める
    const existDarkValidMove = board.existValidMove(Disc.Dark);
    const existLightValidMove = board.existValidMove(Disc.Light);

    if (existDarkValidMove && existLightValidMove) {
      // 両方置ける場合は、前の石と反対の石の番
      return previousDisc === Disc.Dark ? Disc.Light : Disc.Dark;
    } else if (!existDarkValidMove && !existLightValidMove) {
      // 両方置けない場合、次の石はない
      return undefined;
    } else if (existDarkValidMove) {
      // 片方しか置けない場合は、置けるほうの石の番
      return Disc.Dark;
    } else {
      return Disc.Light;
    }
  }

  public gameEnd(): boolean {
    return this.nextDisc === undefined;
  }
}

export const firstTurn = (gameId: number, endAt: Date) => {
  return new Turn(gameId, 0, Disc.Dark, undefined, initialBoard, endAt);
};
