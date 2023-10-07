import mysql from "mysql2/promise";
import { Room } from "../../../domain/room/room";
import { RoomGateway } from "./roomGateway";
import { RoomRepositoryInterface } from "../../../domain/room/roomRepository";

const roomGateway = new RoomGateway();

export class RoomMySQLRepository implements RoomRepositoryInterface {
  async findLatest(conn: mysql.Connection): Promise<Room | undefined> {
    const roomRecord = await roomGateway.findLatest(conn);

    if (!roomRecord) {
      return undefined;
    }

    return new Room(
      roomRecord.id,
      roomRecord.name,
      roomRecord.darkPlayerId,
      roomRecord.lightPlayerId
    );
  }

  async save(conn: mysql.Connection, room: Room): Promise<Room> {
    const roomRecord = await roomGateway.insert(
      conn,
      room.name,
      room.darkPlayerId,
      room.lightPlayerId
    );

    return new Room(
      roomRecord.id,
      roomRecord.name,
      roomRecord.darkPlayerId,
      roomRecord.lightPlayerId
    );
  }

  async update(conn: mysql.Connection, room: Room): Promise<Room> {
    if (!room.id) {
      throw new Error("room id is undefined");
    }

    const roomRecord = await roomGateway.update(
      conn,
      room.id,
      room.name,
      room.darkPlayerId,
      room.lightPlayerId
    );

    return new Room(
      roomRecord.id,
      roomRecord.name,
      roomRecord.darkPlayerId,
      roomRecord.lightPlayerId
    );
  }
}
