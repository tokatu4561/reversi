import mysql from "mysql2/promise";
import { RoomRecord } from "./roomRecord";

export class RoomGateway {
  async findLatest(conn: mysql.Connection) {
    // 最新の対戦を取得
    const roomSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      "SELECT id, name, dark_player_id, light_player_id FROM rooms ORDER BY id DESC LIMIT 1"
    );
    const room = roomSelectResult[0][0];

    if (!room) {
      throw new Error("対戦が見つかりませんでした");
    }

    return new RoomRecord(
      room.id,
      room.name,
      room.dark_player_id,
      room.light_player_id
    );
  }

  async insert(
    conn: mysql.Connection,
    name: string,
    dark_player_id: string,
    light_player_id: string | undefined
  ): Promise<RoomRecord> {
    const roomInsertResult = await conn.execute<mysql.ResultSetHeader>(
      "INSERT INTO rooms (name, dark_player_id, light_player_id) VALUES (?)",
      [name]
    );

    const roomId = roomInsertResult[0].insertId;

    return new RoomRecord(roomId, name, dark_player_id, light_player_id);
  }

  async update(
    conn: mysql.Connection,
    id: number,
    name: string,
    dark_player_id: string,
    light_player_id: string | undefined
  ): Promise<RoomRecord> {
    await conn.execute(
      "UPDATE rooms SET name = ?, light_player_id = ? WHERE id = ?",
      [name, light_player_id, id]
    );

    return new RoomRecord(id, name, dark_player_id, light_player_id);
  }
}
