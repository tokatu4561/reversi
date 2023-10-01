export class FindLastGameQueryData {
  constructor(
    private _gameId: number,
    private _darkCount: number,
    private _lightCount: number,
    private _winnerDisc: number,
    private _startedAt: Date,
    private _endAt: Date
  ) {}

  get gameId() {
    return this._gameId;
  }

  get darkCount() {
    return this._darkCount;
  }

  get lightCount() {
    return this._lightCount;
  }

  get winnerDisc() {
    return this._winnerDisc;
  }

  get endAt() {
    return this._endAt;
  }

  get startedAt() {
    return this._startedAt;
  }
}

export interface FindLastGameQueryInterface {
  query(limit: number): Promise<FindLastGameQueryData[]>;
}
