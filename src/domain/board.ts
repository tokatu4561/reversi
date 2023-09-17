import { Disc } from "./disc";
import { Move } from "./move";

export class Board {
  constructor(private _discs: Disc[][]) {}

  get discs() {
    return this._discs;
  }

  // place is used to place a disc on the board
  public place(move: Move): Board {
    // TODO: 盤面におけるかどうかのチェック

    // 盤面をそのままコピー
    const newDiscs = this._discs.map((row) => {
      return row.map((disc) => {
        return disc;
      });
    });

    // 盤面に置く
    newDiscs[move.point.y][move.point.x] = move.disc;

    // 石をひっくり返す

    return new Board(newDiscs);
  }
}
