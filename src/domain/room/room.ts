export class Room {
  constructor(
    private _id: number | undefined,
    private _name: string,
    private _darkPlayerId: string,
    private _lightPlayerId: string | undefined // room作成時点では 白が参加していないので undefinedもあり得る
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

  public joinLightPlayer(lightPlayerId: string) {
    this._lightPlayerId = lightPlayerId;
  }
}
