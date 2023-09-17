export class TurnRecord {
  constructor(
    private _id: number,
    private _gameId: number,
    private _turnCount: number,
    private _nextDisc: number,
    private _endAt: Date | null
  ) {}

  get id() {
    return this._id;
  }

  get gameId() {
    return this._gameId;
  }

  get turnCount() {
    return this._turnCount;
  }

  get nextDisc() {
    return this._nextDisc;
  }

  get endAt() {
    return this._endAt;
  }
}
