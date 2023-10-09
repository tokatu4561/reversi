import { Room } from "../../domain/room/room";
import { RoomRepositoryInterface } from "../../domain/room/roomRepository";
import { Disc } from "../../domain/turn/disc";
import { connectDB } from "../../infrastructure/connection";

class CreateRoomUseCaseOutput {
  constructor(private _roomId: number) {}

  get roomId() {
    return this._roomId;
  }
}

export class CreateRoomUseCase {
  constructor(private _roomRepository: RoomRepositoryInterface) {}

  async execute() {
    const conn = await connectDB();

    let newRoom: Room;
    try {
      const room = new Room(undefined, "roomName", undefined, undefined); // FIXME: 仮　ルーム名は仮
      newRoom = await this._roomRepository.save(conn, room);
    } finally {
      await conn.end();
    }

    return new CreateRoomUseCaseOutput(newRoom.id!);
  }
}
