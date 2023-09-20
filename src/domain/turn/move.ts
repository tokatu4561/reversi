import { Disc } from "./disc";
import { Point } from "./point";

export class Move {
  private _disc: Disc;
  private _point: Point;

  constructor(_disc: Disc, _point: Point) {
    this._disc = _disc;
    this._point = _point;
  }

  get disc() {
    return this._disc;
  }
  get point() {
    return this._point;
  }
}
