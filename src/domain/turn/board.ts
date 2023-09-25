import { EmptyFlipPoints } from "./error/EmptyFlipPoints";
import { Disc, isOppositeDisc } from "./disc";
import { Move } from "./move";
import { Point } from "./point";
import { NotEmptyPoint } from "./error/NotEmptyPoint";

export class Board {
  private _walledDiscs: Disc[][];

  constructor(private _discs: Disc[][]) {
    this._walledDiscs = this.wallDiscs();
  }

  get discs() {
    return this._discs;
  }

  // place is used to place a disc on the board
  public place(move: Move): Board {
    // 空でない場合は置けない
    if (this._discs[move.point.y][move.point.x] !== Disc.Empty) {
      throw new NotEmptyPoint("The point is not empty");
    }

    // ひっくり返す石のリストを取得
    const flipPoints = this.listFlipPoints(move);

    // ひっくり返す石がない場合は置けない
    if (flipPoints.length === 0) {
      throw new EmptyFlipPoints("There are no flip points");
    }

    // 盤面をそのままコピー
    const newDiscs = this._discs.map((row) => {
      return row.map((disc) => {
        return disc;
      });
    });

    // 盤面に置く
    newDiscs[move.point.y][move.point.x] = move.disc;

    // 石をひっくり返す
    flipPoints.forEach((point) => {
      newDiscs[point.y][point.x] = move.disc;
    });

    return new Board(newDiscs);
  }

  // listFlipPointsDirection help listFlipPoints
  private listFlipPointsDirection(
    move: Move,
    xDirection: number,
    yDirection: number
  ): Point[] {
    const flipPoints: Point[] = [];

    // 番兵を考慮して、1つずらす
    let walledX = move.point.x + 1;
    let walledY = move.point.y + 1;

    walledX += xDirection;
    walledY += yDirection;

    const tmpFlipPoints: Point[] = [];
    while (isOppositeDisc(move.disc, this._walledDiscs[walledY][walledX])) {
      // 番兵を考慮して - 1 する
      tmpFlipPoints.push(new Point(walledX - 1, walledY - 1));
      walledX += xDirection;
      walledY += yDirection;
      // 同じ色の石が見つかれば、ひっくり返す石のリストが確定
      if (move.disc === this._walledDiscs[walledY][walledX]) {
        flipPoints.push(...tmpFlipPoints);
        tmpFlipPoints.splice(0);
        break;
      }
    }

    return flipPoints;
  }

  // listFlipPoints is used to list points that will be flipped when a disc is placed on the board
  private listFlipPoints(move: Move): Point[] {
    const flipPoints: Point[] = [];

    // 8方向について、ひっくり返す石のリストを取得
    // 上
    const flipPointsUp: Point[] = this.listFlipPointsDirection(move, 0, -1);
    // 右上
    const flipPointsUpRight: Point[] = this.listFlipPointsDirection(
      move,
      1,
      -1
    );
    // 右
    const flipPointsRight: Point[] = this.listFlipPointsDirection(move, 1, 0);
    // 右下
    const flipPointsDownRight: Point[] = this.listFlipPointsDirection(
      move,
      1,
      1
    );
    // 下
    const flipPointsDown: Point[] = this.listFlipPointsDirection(move, 0, 1);
    // 左下
    const flipPointsDownLeft: Point[] = this.listFlipPointsDirection(
      move,
      -1,
      1
    );
    // 左
    const flipPointsLeft: Point[] = this.listFlipPointsDirection(move, -1, 0);
    // 左上
    const flipPointsUpLeft: Point[] = this.listFlipPointsDirection(
      move,
      -1,
      -1
    );

    flipPoints.push(
      ...flipPointsUp,
      ...flipPointsUpRight,
      ...flipPointsRight,
      ...flipPointsDownRight,
      ...flipPointsDown,
      ...flipPointsDownLeft,
      ...flipPointsLeft,
      ...flipPointsUpLeft
    );

    return flipPoints;
  }

  private wallDiscs(): Disc[][] {
    const walled: Disc[][] = [];

    const topAndBottomWall = Array(this._discs[0].length + 2).fill(Disc.Wall);

    walled.push(topAndBottomWall);

    this._discs.forEach((line) => {
      const walledLine = [Disc.Wall, ...line, Disc.Wall];
      walled.push(walledLine);
    });

    walled.push(topAndBottomWall);

    return walled;
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
