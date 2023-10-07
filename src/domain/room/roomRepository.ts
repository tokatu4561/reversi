import mysql from "mysql2/promise";
import { Room } from "./room";

export interface RoomRepositoryInterface {
  findLatest(conn: mysql.Connection): Promise<Room | undefined>;
  save(conn: mysql.Connection, room: Room): Promise<Room>;
  update(conn: mysql.Connection, room: Room): Promise<Room>;
}
