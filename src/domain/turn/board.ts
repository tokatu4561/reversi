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

const EMPTY = Disc.Empty;
const DARK = Disc.Dark;
const LIGHT = Disc.Light;

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

export const initialBoard = new Board(INITIAL_BOARD);
