export class GameRecord {
  constructor(
    private _id: number,
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
