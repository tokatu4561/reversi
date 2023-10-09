import { Room } from "../../domain/room/room";
import { RoomRepositoryInterface } from "../../domain/room/roomRepository";
import { Disc } from "../../domain/turn/disc";
import { connectDB } from "../../infrastructure/connection";

class JoinRoomOutput {
  constructor(
    private _roomId: number,
    private _roomName: string,
    private _yourDisc: number,
    private _isReady: boolean = false
  ) {}

  get roomId() {
    return this._roomId;
  }

  get roomName() {
    return this._roomName;
  }

  get yourDisc() {
    return this._yourDisc;
  }

  get isReady() {
    return this._isReady;
  }
}

export class JoinRoomUseCase {
  constructor(private _roomRepository: RoomRepositoryInterface) {}

  async execute() {
    const conn = await connectDB();

    let yourDisc: Disc;
    let playingRoom: Room;

    try {
      await conn.beginTransaction();

      // 最新のルームをとってくる
      const room = await this._roomRepository.findLatest(conn);

      if (!room) {
        throw new Error("room is not found");
      }
      if (!room.id) {
        throw new Error("room id is undefined");
      }

      if (room.isFull()) {
        throw new Error("room is full"); // ドメインエラーにする ドメイン層へ移動する
      }

      // ルームに参加する
      // FIXME: プレイヤーを引数に取るようにする
      yourDisc = room.join();

      const updatedRoom = await this._roomRepository.update(conn, room);
      playingRoom = updatedRoom;

      await conn.commit();
    } finally {
      await conn.end();
    }

    return new JoinRoomOutput(
      playingRoom.id!,
      playingRoom.name,
      yourDisc,
      playingRoom.isReady()
    );
  }
}
