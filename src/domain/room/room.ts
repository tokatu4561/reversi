import { Disc } from "../turn/disc";

export class Room {
  constructor(
    private _id: number | undefined,
    private _name: string,
    private _darkPlayerId: string | undefined, // room作成時点では 参加していないので undefinedもあり得る
    private _lightPlayerId: string | undefined // room作成時点では 参加していないので undefinedもあり得る
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

  private joinLightPlayer(lightPlayerId: string) {
    this._lightPlayerId = lightPlayerId;
  }

  private joinDarkPlayer(darkPlayerId: string) {
    this._darkPlayerId = darkPlayerId;
  }

  public isFull() {
    return !!this._lightPlayerId && !!this._darkPlayerId;
  }

  public join(): Disc {
    // 黒で参加済みであれば、白で参加する
    if (this.darkPlayerId) {
      this.joinLightPlayer("lightPlayerId"); // FIXME: id,名前は仮
      return Disc.Light;
    } else {
      // 黒で参加する
      this.joinDarkPlayer("darkPlayerId"); // FIXME: id,名前は仮
      return Disc.Dark;
    }
  }

  public isReady() {
    return !!this._lightPlayerId && !!this._darkPlayerId;
  }
}
