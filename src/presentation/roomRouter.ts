import express from "express";
import { JoinRoomUseCase } from "../application/usecase/joinRoomUsecase";
import { RoomMySQLRepository } from "../infrastructure/repository/room/roomMySQLRepository";

export const roomRouter = express.Router();

// FIXME: これはDIコンテナでやるべき
const joinRoomUseCase = new JoinRoomUseCase(new RoomMySQLRepository());

interface JoinRoomResponseBody {
  roomId: number;
  roomName: string;
  yourDisc: number;
}

roomRouter.post("/api/rooms", async (req, res) => {
  const output = await joinRoomUseCase.execute();

  const responseBody: JoinRoomResponseBody = {
    roomId: output.roomId,
    roomName: output.roomName,
    yourDisc: output.yourDisc,
  };

  res.status(201).json(responseBody);
});
