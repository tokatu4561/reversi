export class Game {
  constructor(
    private _id: number | undefined,
    private _roomId: number,
    private _startedAt: Date
  ) {}

  get id() {
    return this._id;
  }

  get roomId() {
    return this._roomId;
  }

  get startedAt() {
    return this._startedAt;
  }
}
