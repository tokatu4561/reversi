export class RoomRecord {
  constructor(
    private _id: number,
    private _name: string,
    private _darkPlayerId: string,
    private _lightPlayerId: string | undefined
  ) {}

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get darkPlayerId() {
    return this._darkPlayerId;
  }

  get lightPlayerId() {
    return this._lightPlayerId;
  }
}
