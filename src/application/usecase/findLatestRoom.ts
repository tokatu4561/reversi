import { Room } from "../../domain/room/room";
import { RoomRepositoryInterface } from "../../domain/room/roomRepository";
import { Disc } from "../../domain/turn/disc";
import { connectDB } from "../../infrastructure/connection";

class FindLatestRoomOutput {
  private _roomId: number;
  private _lightPlayerId: string | undefined;
  private _darkPlayerId: string | undefined;

  constructor(room: Room) {
    this._roomId = room.id!;
    this._lightPlayerId = room.lightPlayerId;
    this._darkPlayerId = room.darkPlayerId;
  }

  get roomId() {
    return this._roomId;
  }

  get lightPlayerId() {
    return this._lightPlayerId;
  }

  get darkPlayerId() {
    return this._darkPlayerId;
  }
}

export class FindLatestRoomUseCase {
  constructor(private _roomRepository: RoomRepositoryInterface) {}

  async execute() {
    const conn = await connectDB();

    const room = await this._roomRepository.findLatest(conn);

    if (!room) {
      throw new Error("room is not found");
    }

    return new FindLatestRoomOutput(room);
  }
}
