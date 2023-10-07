import { Room } from "../../domain/room/room";
import { RoomRepositoryInterface } from "../../domain/room/roomRepository";
import { Disc } from "../../domain/turn/disc";
import { connectDB } from "../../infrastructure/connection";

class JoinRoomOutput {
  constructor(
    private _roomId: number,
    private _roomName: string,
    private _yourDisc: number
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
}

export class JoinRoomUseCase {
  constructor(private _roomRepository: RoomRepositoryInterface) {}

  async execute() {
    const conn = await connectDB();

    let yourDisc = Disc.Dark; // FIXME: 仮 ドメイン層に移動する

    let playingRoom;

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

      // まだ白が参加していないルームであれば
      // ルームに対戦相手(白)がまだ参加していなければ、白で参加する
      if (!room?.lightPlayerId) {
        // 白で参加する
        room.joinLightPlayer("lightPlayerId"); // FIXME: id,名前は仮
        const updatedRoom = await this._roomRepository.update(conn, room);
        let yourDisc = Disc.Light; // FIXME: 仮 ドメイン層に移動する
        playingRoom = updatedRoom;
      } else {
        // 既に黒も白も参加しているルームであれば、新しいルームを作成して黒で参加する
        // 新しいルームを作成する
        const room = new Room(undefined, "roomName", "darkPlayerId", undefined);
        const newRoom = await this._roomRepository.save(conn, room);
        playingRoom = newRoom;
      }
    } finally {
      await conn.end();
    }

    return new JoinRoomOutput(playingRoom.id, playingRoom.name, yourDisc);
  }
}
